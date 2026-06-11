import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function Messages() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "John Doe", text: "Is this part still available?", timestamp: "10:30 AM" },
    { id: 2, sender: "You", text: "Yes, it is! Shipping available.", timestamp: "10:35 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: "You", text: newMessage, timestamp: "Now" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Messages</h1>
        <Card className="bg-slate-700 border-slate-600 p-6 flex flex-col h-96">
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === "You" ? "bg-blue-600 text-white" : "bg-slate-600 text-slate-200"}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type message..." className="bg-slate-600 border-slate-500 text-white" />
            <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700"><Send size={18} /></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
