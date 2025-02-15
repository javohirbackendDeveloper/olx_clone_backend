const { getReceiverSocketId, io } = require("../lib/socket");
const authSchema = require("../schema/auth.schema");
const messageSchema = require("../schema/message.schema");
const { cloudinary } = require("../utils/cloudinary");

// const getUsersForSidebar = async (req, res) => {
//   try {
//     const current_user = req.user;
//     let other_users = []

//    current_user?.user_talks.map((talk) => {
//     const user = await
//    })

//     // const other_users = await authSchema
//     //   .find({ _id: { $in: current_user.user_talks } })
//     //   .select("-password");

//     res.json(other_users);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Xatolik yuz berdi" });
//   }
// };

const getUsersForSidebar = async (req, res) => {
  try {
    const current_user = req.user;
    let other_users = [];

    for (let chat_id of current_user?.user_talks) {
      const chat = await messageSchema.findById(chat_id);

      if (chat) {
        const receiver_id =
          chat.receiver_id === current_user._id
            ? chat.sender_id
            : chat.receiver_id;

        const user = await authSchema.findById(receiver_id).select("-password");

        if (
          user &&
          user?._id.toString() !== current_user?._id.toString() &&
          !other_users.some(
            (existingUser) =>
              existingUser._id.toString() === user._id.toString()
          )
        ) {
          other_users.push(user);
        }
      }
    }

    res.json(other_users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const myId = req.user._id.toString();

    const messages = await messageSchema.find({
      $or: [
        { sender_id: myId, receiver_id: userToChatId },
        { sender_id: userToChatId, receiver_id: myId },
      ],
    });

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Xabarlarni olishda xatolik" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiver_id } = req.params;

    const sender_id = req.user?._id;
    const receiver_user = await authSchema.findById(receiver_id);

    if (!receiver_user) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    let imageUrl = null;
    if (image) {
      const uploadresponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadresponse.secure_url;
    }

    const newMessage = await messageSchema.create({
      sender_id,
      receiver_id,
      text,
      image: imageUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    req.user.user_talks.push(newMessage._id);
    await req.user.save();

    receiver_user.user_talks.push(newMessage._id);
    await receiver_user.save();

    res.json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Xabar yuborishda xatolik" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { receiver_id } = req.params;
    const current_user = req.user;
    // console.log({ current_user, receiver_id });

    for (let index = 0; index < current_user.user_talks.length; index++) {
      const converse = current_user.user_talks[index];
      const chat = await messageSchema.findOne({ _id: converse });

      if (chat) {
        if (
          chat.sender_id.toString() === receiver_id ||
          chat.receiver_id.toString() === receiver_id
        ) {
          current_user.user_talks.splice(index, 1);
          await current_user.save();
        }
      }
    }

    res.json({ message: "Muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  deleteUser,
};
