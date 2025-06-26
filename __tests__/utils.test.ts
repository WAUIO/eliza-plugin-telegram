import { describe, expect, it } from 'vitest';
import { convertMarkdownToTelegram, splitMessage } from '../src/utils';

describe('Telegram Utils', () => {
  describe('splitMessage', () => {
    it('should not split message within limit', () => {
      const message = 'Hello World';
      const chunks = splitMessage(message, 4096);
      expect(chunks).toEqual(['Hello World']);

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should handle empty string', () => {
      const chunks = splitMessage('');
      expect(chunks).toEqual([]);

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should keep message intact if shorter than maxLength', () => {
      const message = 'Hello World';
      const chunks = splitMessage(message, 6);
      expect(chunks).toEqual(['Hello World']);

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
  });

  describe('convertMarkdownToTelegram', () => {
    it('should handle text without special characters', () => {
      const input = 'Hello World 123';
      expect(convertMarkdownToTelegram(input)).toBe(input);

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should handle empty string', () => {
      expect(convertMarkdownToTelegram('')).toBe('');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should convert headers to bold text', () => {
      const result = convertMarkdownToTelegram('# Header 1\n## Header 2');
      expect(result).toContain('*Header 1*');
      expect(result).toContain('*Header 2*');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should convert bold text correctly', () => {
      const result = convertMarkdownToTelegram('This is **bold text**');
      expect(result).toBe('This is *bold text*');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should convert italic text correctly', () => {
      const result = convertMarkdownToTelegram('This is *italic text*');
      expect(result).toBe('This is _italic text_');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should convert strikethrough text correctly', () => {
      const result = convertMarkdownToTelegram('This is ~~strikethrough text~~');
      expect(result).toBe('This is ~strikethrough text~');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should convert inline code correctly', () => {
      const result = convertMarkdownToTelegram('This is `inline code`');
      expect(result).toBe('This is `inline code`');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should convert links correctly', () => {
      const result = convertMarkdownToTelegram('[Google](https://www.google.com)');
      expect(result).toBe('\\[Google\\]\\(https://www\\.google\\.com\\)');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should convert code blocks correctly', () => {
      const result = convertMarkdownToTelegram('```javascript\nconsole.log("test");\n```');
      expect(result).toContain('```javascript');
      expect(result).toContain('```javascript\nconsole.log(\"test\");\n```');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should convert blockquotes correctly', () => {
      const result = convertMarkdownToTelegram('> This is a blockquote');
      expect(result).toBe('> This is a blockquote');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should escape special characters correctly', () => {
      const result = convertMarkdownToTelegram(
        'These chars: _ * [ ] ( ) ~ ` > # + - = | { } . ! \\'
      );
      expect(result).toBe(
        'These chars: \\_ \\* \\[ \\] \\( \\) \\~ \\` \\> \\# \\+ \\- \\= \\| \\{ \\} \\. \\! \\\\'
      );

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should handle mixed formatting correctly', () => {
      const result = convertMarkdownToTelegram(
        '**Bold** and *italic* and `code` and ~~strikethrough~~'
      );
      expect(result).toBe('*Bold* and _italic_ and `code` and ~strikethrough~');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should handle nested formatting correctly', () => {
      const result = convertMarkdownToTelegram('**Bold and *italic***');
      expect(result).toBe('\\*\\*Bold and \\*italic\\*\\*\\*');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should handle URLs with special characters correctly', () => {
      const result = convertMarkdownToTelegram('[Link](https://example.com/path(with)parentheses)');
      expect(result).toBe('\\[Link\\]\\(https://example\\.com/path\\(with\\)parentheses\\)');

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
    });

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
  });

    it('should split message properly when single line exceeds maxLength', () => {
      const message = 'This is a very long line that definitely exceeds the maximum length limit';
      const chunks = splitMessage(message, 30);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.every(chunk => chunk.length <= 30)).toBe(true);
    });

    it('should handle message with multiple newlines', () => {
      const message = 'Line 1


Line 2

Line 3';
      const chunks = splitMessage(message, 20);
      expect(chunks.join('
')).toBe(message);
    });

    it('should split on newlines when possible', () => {
      const message = 'Short line
Another short line
Yet another line';
      const chunks = splitMessage(message, 50);
      expect(chunks).toEqual([message]);
    });

    it('should handle very long single line', () => {
      const longLine = 'a'.repeat(5000);
      const chunks = splitMessage(longLine, 1000);
      expect(chunks.length).toBe(5);
      expect(chunks.every(chunk => chunk.length <= 1000)).toBe(true);
    });

    it('should preserve line structure when splitting', () => {
      const message = 'Line 1
Line 2 is longer
Line 3';
      const chunks = splitMessage(message, 15);
      const rejoined = chunks.join('
');
      expect(rejoined).toBe(message);
    });

    it('should handle Unicode characters correctly', () => {
      const message = '🌍🚀💯
测试中文
Ελληνικά';
      const chunks = splitMessage(message, 10);
      expect(chunks.join('
')).toBe(message);
    });

    it('should handle whitespace-only messages', () => {
      const message = '   
  
   ';
      const chunks = splitMessage(message, 5);
      expect(chunks.join('
')).toBe(message);
    });
});
