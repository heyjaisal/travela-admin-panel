const Conversation = require("../models/conversation");
const Message = require("../models/message");
// POST /api/chat/conversation/start
exports.createOrGetConversation = async (req, res) => {
    const { fromId, fromType, toId, toType } = req.body;
    
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [{ id: fromId, type: fromType }, { id: toId, type: toType }] },
      });
 
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [
            { id: fromId, type: fromType },
            { id: toId, type: toType },
          ],
          unreadCount: {
            [fromId.toString()]: 0,
            [toId.toString()]: 0,
          },
        });
      }
  
      res.status(200).json({ conversationId: conversation._id });
    } catch (err) {
      res.status(500).json({ error: "Error creating conversation" });
    }
  };
  
  // POST /api/chat/sendMessage
exports.sendMessage = async (req, res) => {
    const { fromId, fromType, toId, toType, messageType, content, fileName } = req.body;
  
    try {
      const conversation = await createOrGetConversation(fromId, fromType, toId, toType);
      const message = await Message.create({
        fromId,
        fromType,
        toId,
        toType,
        messageType,
        content,
        fileName,
      });
  
      // Update the conversation with the latest message
      conversation.lastMessage = message._id;
      conversation.unreadCount.set(
        toId.toString(),
        (conversation.unreadCount.get(toId.toString()) || 0) + 1
      );
      await conversation.save();
  
      res.status(200).json({ message });
    } catch (err) {
      res.status(500).json({ error: "Error sending message" });
    }
  };
  // GET /api/chat/messages/:conversationId
exports.getMessages = async (req, res) => {
    const { conversationId } = req.params;
    
    try {
      const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
      res.status(200).json({ messages });
    } catch (err) {
      res.status(500).json({ error: "Error fetching messages" });
    }
  };
  // POST /api/chat/markAsRead
exports.markMessagesAsRead = async (req, res) => {
    const { conversationId, userId } = req.body;
  
    try {
      // Mark all unread messages for the user as read
      await Message.updateMany(
        { toId: userId, isRead: false },
        { $set: { isRead: true } }
      );
  
      // Reset unread count for the user
      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { [`unreadCount.${userId}`]: 0 } }
      );
  
      res.status(200).json({ message: "Messages marked as read" });
    } catch (err) {
      res.status(500).json({ error: "Error marking messages as read" });
    }
  };
  