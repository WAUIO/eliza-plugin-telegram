import { Readable } from 'node:stream';
import type { IAgentRuntime } from '@elizaos/core';
import { type Context, Telegraf } from 'telegraf';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaType, MessageManager } from '../src/messageManager';

// Create mock functions directly to have access to them
const sendMessageMock = vi.fn().mockResolvedValue({ message_id: 123 });
const sendPhotoMock = vi.fn().mockResolvedValue({ message_id: 124 });
const sendChatActionMock = vi.fn().mockResolvedValue(true);
const sendVideoMock = vi.fn().mockResolvedValue({ message_id: 125 });
const sendDocumentMock = vi.fn().mockResolvedValue({ message_id: 126 });
const sendAudioMock = vi.fn().mockResolvedValue({ message_id: 127 });
const sendAnimationMock = vi.fn().mockResolvedValue({ message_id: 128 });

// Mock Telegraf
vi.mock('telegraf', () => {
  return {
    Telegraf: vi.fn().mockImplementation(() => ({
      telegram: {
        sendMessage: sendMessageMock,
        sendChatAction: sendChatActionMock,
        sendPhoto: sendPhotoMock,
        sendVideo: sendVideoMock,
        sendDocument: sendDocumentMock,
        sendAudio: sendAudioMock,
        sendAnimation: sendAnimationMock,
      },
    })),
    Markup: {
      markdown: vi.fn(() => ({})),
      inlineKeyboard: vi.fn(() => ({})),
    },
  };
});

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(true),
    createReadStream: vi.fn(() => {
      const stream = new Readable();
      stream._read = () => {};
      return stream;
    }),
  },
}));

describe('MessageManager', () => {
  let mockRuntime: IAgentRuntime;
  let mockBot: Telegraf<Context>;
  let messageManager: MessageManager;
  const CHAT_ID = 123456789;

  beforeEach(() => {
    mockRuntime = {
      getSetting: vi.fn(),
      getCharacter: vi.fn(),
      getFlow: vi.fn(),
      getPlugin: vi.fn(),
      getPlugins: vi.fn(),
      getSafePlugins: vi.fn(),
      hasPlugin: vi.fn(),
      registerPlugin: vi.fn(),
      removePlugin: vi.fn(),
      setCharacter: vi.fn(),
      setFlow: vi.fn(),
    } as Partial<IAgentRuntime> as IAgentRuntime;

    mockBot = new Telegraf('mock_token') as any;
    messageManager = new MessageManager(mockBot, mockRuntime);
    vi.clearAllMocks();
  });

  describe('message sending', () => {
    it('should send a message successfully', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const content = { text: 'Test message' };
      const result = await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith(
        CHAT_ID,
        content.text,
        expect.objectContaining({
          parse_mode: 'MarkdownV2',
        })
      );
      expect(result[0].message_id).toBe(123);
    });

    it('should split long messages', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      // Create a message that's just over 4096 characters (Telegram's limit)
      const message1 = 'a'.repeat(4096);
      const message2 = 'b'.repeat(100);
      const content = { text: `${message1}\n${message2}` };
      await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledTimes(2);
      expect(mockBot.telegram.sendMessage).toHaveBeenNthCalledWith(
        1,
        CHAT_ID,
        message1,
        expect.objectContaining({ parse_mode: 'MarkdownV2' })
      );
      expect(mockBot.telegram.sendMessage).toHaveBeenNthCalledWith(
        2,
        CHAT_ID,
        message2,
        expect.objectContaining({ parse_mode: 'MarkdownV2' })
      );
    });
  });

  describe('image handling', () => {
    it('should send an image from URL', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const imageUrl = 'https://example.com/image.jpg';
      await messageManager.sendMedia(ctx, imageUrl, MediaType.PHOTO);

      expect(mockBot.telegram.sendPhoto).toHaveBeenCalledWith(
        CHAT_ID,
        imageUrl,
        expect.any(Object)
      );
    });

    it('should send an image from local file', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const localPath = '/path/to/image.jpg';
      await messageManager.sendMedia(ctx, localPath, MediaType.PHOTO);

      expect(mockBot.telegram.sendPhoto).toHaveBeenCalledWith(
        CHAT_ID,
        expect.objectContaining({ source: expect.any(Object) }),
        expect.any(Object)
      );
    });
  });

  describe('error handling', () => {
    it('should handle send message errors', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const error = new Error('Network error');
      sendMessageMock.mockRejectedValueOnce(error);

      await expect(messageManager.sendMessageInChunks(ctx, { text: 'test' })).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle image send errors', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const error = new Error('Image send failed');
      sendPhotoMock.mockRejectedValueOnce(error);

      await expect(messageManager.sendMedia(ctx, 'test.jpg', MediaType.PHOTO)).rejects.toThrow(
        'Image send failed'
      );
    });
  });
});

  describe('MediaType scenarios', () => {
    it('should send video media with caption', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const videoUrl = 'https://example.com/video.mp4';
      const caption = 'Test video caption';
      await messageManager.sendMedia(ctx, videoUrl, MediaType.VIDEO, caption);

      expect(mockBot.telegram.sendVideo).toHaveBeenCalledWith(
        CHAT_ID,
        videoUrl,
        expect.objectContaining({ caption })
      );
    });

    it('should send document media', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const docUrl = 'https://example.com/document.pdf';
      await messageManager.sendMedia(ctx, docUrl, MediaType.DOCUMENT);

      expect(mockBot.telegram.sendDocument).toHaveBeenCalledWith(
        CHAT_ID,
        docUrl,
        expect.any(Object)
      );
    });

    it('should send audio media', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const audioUrl = 'https://example.com/audio.mp3';
      await messageManager.sendMedia(ctx, audioUrl, MediaType.AUDIO);

      expect(mockBot.telegram.sendAudio).toHaveBeenCalledWith(
        CHAT_ID,
        audioUrl,
        expect.any(Object)
      );
    });

    it('should send animation media', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const gifUrl = 'https://example.com/animation.gif';
      await messageManager.sendMedia(ctx, gifUrl, MediaType.ANIMATION);

      expect(mockBot.telegram.sendAnimation).toHaveBeenCalledWith(
        CHAT_ID,
        gifUrl,
        expect.any(Object)
      );
    });

    it('should throw error for unsupported media type', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const unsupportedType = 'unsupported' as MediaType;
      
      await expect(messageManager.sendMedia(ctx, 'test.file', unsupportedType))
        .rejects.toThrow('Unsupported media type');
    });
  });

  describe('processImage method', () => {
    beforeEach(() => {
      // Mock getFileLink and runtime.useModel
      mockBot.telegram.getFileLink = vi.fn().mockResolvedValue(new URL('https://example.com/image.jpg'));
      mockRuntime.useModel = vi.fn().mockResolvedValue({
        title: 'Test Image',
        description: 'A test image description'
      });
    });

    it('should process photo message', async () => {
      const message = {
        photo: [
          { file_id: 'photo1', width: 100, height: 100 },
          { file_id: 'photo2', width: 200, height: 200 }
        ],
        message_id: 123,
        chat: { id: CHAT_ID, type: 'private' },
        from: { id: 456, is_bot: false, first_name: 'Test' },
        date: Date.now() / 1000
      };

      const result = await messageManager.processImage(message as any);

      expect(mockBot.telegram.getFileLink).toHaveBeenCalledWith('photo2'); // Should use largest photo
      expect(mockRuntime.useModel).toHaveBeenCalled();
      expect(result).toEqual({
        description: '[Image: Test Image\nA test image description]'
      });
    });

    it('should process document with image mime type', async () => {
      const message = {
        document: {
          file_id: 'doc123',
          mime_type: 'image/png'
        },
        message_id: 123,
        chat: { id: CHAT_ID, type: 'private' },
        from: { id: 456, is_bot: false, first_name: 'Test' },
        date: Date.now() / 1000
      };

      const result = await messageManager.processImage(message as any);

      expect(mockBot.telegram.getFileLink).toHaveBeenCalledWith('doc123');
      expect(result).toEqual({
        description: '[Image: Test Image\nA test image description]'
      });
    });

    it('should return null for non-image message', async () => {
      const message = {
        text: 'Just text',
        message_id: 123,
        chat: { id: CHAT_ID, type: 'private' },
        from: { id: 456, is_bot: false, first_name: 'Test' },
        date: Date.now() / 1000
      };

      const result = await messageManager.processImage(message as any);

      expect(result).toBeNull();
      expect(mockBot.telegram.getFileLink).not.toHaveBeenCalled();
    });

    it('should handle processImage errors gracefully', async () => {
      mockBot.telegram.getFileLink = vi.fn().mockRejectedValue(new Error('API Error'));
      
      const message = {
        photo: [{ file_id: 'photo1', width: 100, height: 100 }],
        message_id: 123,
        chat: { id: CHAT_ID, type: 'private' },
        from: { id: 456, is_bot: false, first_name: 'Test' },
        date: Date.now() / 1000
      };

      const result = await messageManager.processImage(message as any);

      expect(result).toBeNull();
    });
  });

  describe('sendMessage public method', () => {
    it('should send message to specific chat ID', async () => {
      const content = { text: 'Direct message' };
      const chatId = 987654321;

      const result = await messageManager.sendMessage(chatId, content);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith(
        chatId,
        content.text,
        expect.objectContaining({
          parse_mode: 'MarkdownV2'
        })
      );
      expect(result).toHaveLength(1);
      expect(result[0].message_id).toBe(123);
    });

    it('should send message with reply', async () => {
      const content = { text: 'Reply message' };
      const chatId = 987654321;
      const replyToMessageId = 456;

      await messageManager.sendMessage(chatId, content, replyToMessageId);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith(
        chatId,
        content.text,
        expect.objectContaining({
          reply_parameters: { message_id: replyToMessageId },
          parse_mode: 'MarkdownV2'
        })
      );
    });

    it('should handle sendMessage errors', async () => {
      sendMessageMock.mockRejectedValueOnce(new Error('Send failed'));
      
      const content = { text: 'Test message' };
      const result = await messageManager.sendMessage(123, content);

      expect(result).toEqual([]);
    });
  });

  describe('edge cases and input validation', () => {
    it('should handle empty message text', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const content = { text: '' };
      const result = await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith(
        CHAT_ID,
        '',
        expect.objectContaining({
          parse_mode: 'MarkdownV2',
        })
      );
      expect(result).toHaveLength(1);
    });

    it('should handle undefined ctx.chat', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: undefined,
      } as Context;

      const content = { text: 'Test message' };
      const result = await messageManager.sendMessageInChunks(ctx, content);

      expect(result).toEqual([]);
      expect(mockBot.telegram.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle message with attachments', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const content = {
        text: 'Message with attachment',
        attachments: [
          {
            url: 'https://example.com/image.jpg',
            contentType: 'image/jpeg',
            description: 'Test image'
          }
        ]
      };

      const result = await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendPhoto).toHaveBeenCalledWith(
        CHAT_ID,
        'https://example.com/image.jpg',
        expect.objectContaining({ caption: 'Test image' })
      );
      expect(result).toEqual([]); // Returns empty array when handling attachments
    });

    it('should handle message exactly at 4096 character limit', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const content = { text: 'a'.repeat(4096) };
      await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledTimes(1);
    });

    it('should handle message with newlines at boundary', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const part1 = 'a'.repeat(4090);
      const part2 = 'b'.repeat(100);
      const content = { text: `${part1}\n${part2}` };
      
      await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledTimes(2);
    });
  });

  describe('file system and media handling edge cases', () => {
    it('should handle non-existent local file', async () => {
      const fs = await import('fs');
      vi.mocked(fs.default.existsSync).mockReturnValueOnce(false);

      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const localPath = '/path/to/nonexistent.jpg';
      
      await expect(messageManager.sendMedia(ctx, localPath, MediaType.PHOTO))
        .rejects.toThrow('File not found at path');
    });

    it('should handle undefined ctx.chat in sendMedia', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: undefined,
      } as Context;

      await expect(messageManager.sendMedia(ctx, 'test.jpg', MediaType.PHOTO))
        .rejects.toThrow('sendMedia: ctx.chat is undefined');
    });

    it('should properly handle file streams', async () => {
      const fs = await import('fs');
      const mockStream = new Readable();
      mockStream._read = () => {};
      mockStream.destroy = vi.fn();
      
      vi.mocked(fs.default.createReadStream).mockReturnValue(mockStream as any);

      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const localPath = '/path/to/image.jpg';
      await messageManager.sendMedia(ctx, localPath, MediaType.PHOTO);

      expect(mockStream.destroy).toHaveBeenCalled();
    });
  });

  describe('concurrent operations', () => {
    it('should handle multiple simultaneous message sends', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const messages = [
        { text: 'Message 1' },
        { text: 'Message 2' },
        { text: 'Message 3' }
      ];

      const promises = messages.map(msg => 
        messageManager.sendMessageInChunks(ctx, msg)
      );

      const results = await Promise.all(promises);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledTimes(3);
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result[0]).toHaveProperty('message_id');
      });
    });

    it('should handle mixed media and text sends', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const promises = [
        messageManager.sendMessageInChunks(ctx, { text: 'Text message' }),
        messageManager.sendMedia(ctx, 'https://example.com/image.jpg', MediaType.PHOTO),
        messageManager.sendMedia(ctx, 'https://example.com/video.mp4', MediaType.VIDEO)
      ];

      await Promise.all(promises);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledTimes(1);
      expect(mockBot.telegram.sendPhoto).toHaveBeenCalledTimes(1);
      expect(mockBot.telegram.sendVideo).toHaveBeenCalledTimes(1);
    });
  });

  describe('error recovery and resilience', () => {
    it('should handle network timeout errors', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const timeoutError = new Error('ETIMEDOUT');
      sendMessageMock.mockRejectedValueOnce(timeoutError);

      await expect(messageManager.sendMessageInChunks(ctx, { text: 'test' }))
        .rejects.toThrow('ETIMEDOUT');
    });

    it('should handle Telegram API errors', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const apiError = new Error('Bad Request: message is too long');
      sendMessageMock.mockRejectedValueOnce(apiError);

      await expect(messageManager.sendMessageInChunks(ctx, { text: 'test' }))
        .rejects.toThrow('Bad Request: message is too long');
    });

    it('should handle sendPhoto errors', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const photoError = new Error('Bad Request: invalid photo URL');
      sendPhotoMock.mockRejectedValueOnce(photoError);

      await expect(messageManager.sendMedia(ctx, 'invalid-url', MediaType.PHOTO))
        .rejects.toThrow('Bad Request: invalid photo URL');
    });
  });

  describe('message formatting and parsing', () => {
    it('should handle messages with buttons', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const content = {
        text: 'Message with buttons',
        buttons: [
          [{ text: 'Button 1', action: 'action1' }],
          [{ text: 'Button 2', action: 'action2' }]
        ]
      };

      await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith(
        CHAT_ID,
        expect.any(String),
        expect.objectContaining({
          parse_mode: 'MarkdownV2'
        })
      );
    });

    it('should handle emoji and unicode characters', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const content = { text: 'Hello 👋 🌍 🚀 测试 مرحبا' };
      await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith(
        CHAT_ID,
        expect.any(String),
        expect.objectContaining({
          parse_mode: 'MarkdownV2',
        })
      );
    });

    it('should handle very long single words', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      // Single word longer than 4096 characters
      const content = { text: 'a'.repeat(5000) };
      await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledTimes(2);
    });
  });

  describe('attachment handling edge cases', () => {
    it('should handle unsupported attachment content type', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const content = {
        attachments: [
          {
            url: 'https://example.com/file.xyz',
            contentType: 'application/unknown'
          }
        ]
      };

      await expect(messageManager.sendMessageInChunks(ctx, content))
        .rejects.toThrow('Unsupported Telegram attachment content type');
    });

    it('should handle GIF attachments as animations', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      const content = {
        attachments: [
          {
            url: 'https://example.com/animation.gif',
            contentType: 'image/gif',
            description: 'Animated GIF'
          }
        ]
      };

      const result = await messageManager.sendMessageInChunks(ctx, content);

      expect(mockBot.telegram.sendAnimation).toHaveBeenCalledWith(
        CHAT_ID,
        'https://example.com/animation.gif',
        expect.objectContaining({ caption: 'Animated GIF' })
      );
      expect(result).toEqual([]);
    });
  });

  describe('typing indicator', () => {
    it('should send typing action before message', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      await messageManager.sendMessageInChunks(ctx, { text: 'Test message' });

      expect(mockBot.telegram.sendChatAction).toHaveBeenCalledWith(CHAT_ID, 'typing');
      expect(mockBot.telegram.sendChatAction).toHaveBeenCalledBefore(
        mockBot.telegram.sendMessage as any
      );
    });

    it('should handle sendChatAction errors gracefully', async () => {
      const ctx = {
        telegram: mockBot.telegram,
        chat: { id: CHAT_ID },
      } as Context;

      sendChatActionMock.mockRejectedValueOnce(new Error('Chat action failed'));

      // Should still send message even if chat action fails
      await messageManager.sendMessageInChunks(ctx, { text: 'Test message' });

      expect(mockBot.telegram.sendMessage).toHaveBeenCalled();
    });
  });

  describe('constructor and initialization', () => {
    it('should initialize with bot and runtime', () => {
      const newMessageManager = new MessageManager(mockBot, mockRuntime);
      
      expect(newMessageManager.bot).toBe(mockBot);
      expect(newMessageManager['runtime']).toBe(mockRuntime);
    });

    it('should be instance of MessageManager', () => {
      expect(messageManager).toBeInstanceOf(MessageManager);
    });
  });
});
