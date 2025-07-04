import express from 'express';
import Chat from '../models/Chat.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's chats
router.get('/chats', async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
    .populate('participants', 'displayName email photoURL')
    .populate('lastMessage.senderId', 'displayName')
    .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new chat
router.post('/chats', async (req, res) => {
  try {
    const { participantIds, isGroupChat, groupName } = req.body;
    
    const participants = [req.user._id, ...participantIds];
    
    // Check if chat already exists (for direct messages)
    if (!isGroupChat && participantIds.length === 1) {
      const existingChat = await Chat.findOne({
        participants: { $all: participants, $size: 2 },
        isGroupChat: false
      });
      
      if (existingChat) {
        return res.json(existingChat);
      }
    }

    const chat = new Chat({
      participants,
      isGroupChat,
      groupName,
      messages: [],
      unreadCount: new Map()
    });

    await chat.save();
    await chat.populate('participants', 'displayName email photoURL');

    res.status(201).json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/chats/:chatId/messages', async (req, res) => {
  try {
    const { content } = req.body;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = {
      senderId: req.user._id,
      content,
      timestamp: new Date(),
      isRead: false
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    
    // Update unread count for other participants
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        const currentCount = chat.unreadCount.get(participantId.toString()) || 0;
        chat.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await chat.save();

    // Emit real-time message via Socket.io
    const io = req.app.get('io');
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        io.to(participantId.toString()).emit('new-message', {
          chatId,
          message,
          senderName: req.user.displayName
        });
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get followers
router.get('/followers', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'displayName email photoURL preferences');
    
    res.json(user.followers);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get following
router.get('/following', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('following', 'displayName email photoURL preferences');
    
    res.json(user.following);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;