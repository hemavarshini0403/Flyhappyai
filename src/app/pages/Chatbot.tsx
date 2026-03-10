import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm FlyHappy Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "You can ask me about:\n• How to file a complaint\n• Complaint categories\n• Required documents\n• Tracking your complaint\n• Refund policies\n• Flight delay compensation",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Greeting
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello! How can I assist you with your airline complaint today?";
    }

    // How to file complaint
    if (
      msg.includes("file") ||
      msg.includes("register") ||
      msg.includes("submit") ||
      msg.includes("how to")
    ) {
      return "To file a complaint:\n1. Go to 'Register Complaint' page\n2. Fill in your passenger and flight details\n3. Or upload your boarding pass/ticket for auto-fill\n4. Describe your complaint in detail\n5. Submit - our AI will automatically categorize and assign priority\n\nYou'll receive a complaint ID to track your status.";
    }

    // Categories
    if (msg.includes("category") || msg.includes("categories") || msg.includes("type")) {
      return "We handle these complaint categories:\n• Flight Delay\n• Flight Cancellation\n• Baggage Issues (lost, damaged)\n• Refund Requests\n• Staff Behaviour\n• Seat Issues\n• Food/Beverage Issues\n• Overbooking\n• General Service Issues\n\nOur AI will automatically classify your complaint!";
    }

    // Documents
    if (msg.includes("document") || msg.includes("upload") || msg.includes("need")) {
      return "Recommended documents:\n• Boarding pass\n• E-ticket/booking confirmation\n• PNR details\n• Photos/videos of issue (for baggage damage, etc.)\n• Invoice/receipt (for refund claims)\n\nYou can upload images and our OCR will auto-extract details!";
    }

    // Track
    if (msg.includes("track") || msg.includes("status") || msg.includes("check")) {
      return "To track your complaint:\n1. Go to 'Track Complaint' page\n2. Enter your Complaint ID\n3. View real-time status and timeline\n\nStatus flow: Submitted → Under Review → In Process → Resolved/Rejected";
    }

    // Delay compensation
    if (
      msg.includes("delay") ||
      msg.includes("compensation") ||
      msg.includes("refund")
    ) {
      return "For flight delays:\n• 0-2 hours: Refreshments\n• 2-4 hours: Meals + refreshments\n• 4+ hours: Hotel accommodation (if overnight)\n\nCancellations usually qualify for full refund or alternate flight.\n\nFile a complaint with delay details for compensation claim.";
    }

    // Baggage
    if (msg.includes("baggage") || msg.includes("luggage") || msg.includes("lost")) {
      return "For baggage issues:\n• Lost baggage: Report immediately at airport + file complaint\n• Damaged baggage: Take photos, file complaint within 7 days\n• Delayed baggage: Track via airline + file complaint\n\nInclude photos and baggage tag number in your complaint.";
    }

    // Priority
    if (msg.includes("priority") || msg.includes("urgent") || msg.includes("important")) {
      return "Complaint priority is automatically assigned by our AI:\n\n• HIGH: Cancellations, overbooking, lost items, medical issues\n• MEDIUM: Delays, baggage damage, refund requests\n• LOW: Staff behavior, seat comfort, food quality\n\nUrgent keywords in your description increase priority!";
    }

    // Default response
    return "I'm here to help! You can ask me about:\n• Filing a complaint\n• Complaint categories\n• Required documents\n• Tracking status\n• Compensation policies\n• Priority levels\n\nWhat would you like to know?";
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Get bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);

    setInputText("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold">FlyHappy Assistant</h2>
              <p className="text-sm text-indigo-100">AI-powered help chatbot</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "bot"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {message.sender === "bot" ? (
                  <Bot className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "bot"
                    ? "bg-white border border-gray-200 text-gray-900"
                    : "bg-indigo-600 text-white"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "bot" ? "text-gray-500" : "text-indigo-100"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
