import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const projectOptions = [
  "Check EMI Status",
  "Pay EMI",
  "Loan Application Status",
  "Apply for a New Loan",
  "Document Assistance",
  "Contact Support",
];

// Mock loan data for realistic responses
const mockLoanData = {
  userLoans: [
    { id: "LN12345", status: "Active", emiDue: "₹12,500 due on May 10, 2025" },
    { id: "LN67890", status: "Under Review", emiDue: null },
  ],
  requiredDocuments: [
    "PAN Card",
    "Aadhar Card",
    "Bank Statement (last 6 months)",
    "Salary Slips (last 3 months)",
  ],
};

const Chatbot = ({ isLoggedIn, username }) => {
  const [messages, setMessages] = useState([
    {
      text: `👋 Hello${username ? ", " + username : ""}! Welcome to PLMS Assistant. How can I help you manage your loans today?`,
      sender: "bot",
      options: projectOptions,
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const requireLogin = (actionText) => {
    setMessages((prev) => [
      ...prev,
      {
        text: `🔒 Please log in to ${actionText}. Redirecting to the login page...`,
        sender: "bot",
        options: [],
      },
    ]);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 2000);
  };

  const getBotResponse = (query) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let response;
      switch (query.toLowerCase()) {
        case "check emi status":
          if (!isLoggedIn) return requireLogin("check your EMI status");
          response = {
            text:
              mockLoanData.userLoans.length > 0
                ? `Here are your active loans:\n${mockLoanData.userLoans
                    .map(
                      (loan) =>
                        `• Loan ID: ${loan.id} (${loan.status})\n  EMI: ${
                          loan.emiDue || "No EMI due"
                        }`
                    )
                    .join("\n")}\n\nEnter a Loan ID for more details or go back.`
                : "You have no active loans. Would you like to apply for a new one?",
            options: mockLoanData.userLoans.length
              ? ["Enter Loan ID", "Back to Main Menu"]
              : ["Apply for a New Loan", "Back to Main Menu"],
          };
          break;
        case "pay emi":
          if (!isLoggedIn) return requireLogin("pay your EMI");
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setMessages((prev) => [
              ...prev,
              {
                text: "Redirecting to the secure EMI payment portal. Please follow the instructions to complete your payment.",
                sender: "bot",
                options: ["Back to Main Menu"],
              },
            ]);
            navigate("/pay-emi");
          }, 1500);
          response = { text: "Initiating payment session...", options: [] };
          break;
        case "loan application status":
          if (!isLoggedIn) return requireLogin("check your application status");
          response = {
            text:
              mockLoanData.userLoans.length > 0
                ? `Your applications:\n${mockLoanData.userLoans
                    .map((loan) => `• Loan ID: ${loan.id} (${loan.status})`)
                    .join("\n")}\n\nEnter a Loan ID for details or go back.`
                : "No loan applications found. Would you like to apply for a new loan?",
            options: mockLoanData.userLoans.length
              ? ["Enter Loan ID", "Back to Main Menu"]
              : ["Apply for a New Loan", "Back to Main Menu"],
          };
          break;
        case "apply for a new loan":
          if (!isLoggedIn) return requireLogin("apply for a new loan");
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            navigate("/apply-loan");
          }, 1500);
          response = {
            text: "Redirecting to the loan application form...",
            options: [],
          };
          break;
        case "document assistance":
          if (!isLoggedIn) return requireLogin("manage your documents");
          response = {
            text: "I can help with loan document requirements or uploads. What do you need?",
            options: [
              "View Required Documents",
              "Upload Documents",
              "Back to Main Menu",
            ],
          };
          break;
        case "contact support":
          response = {
            text: "Reach our support team at support@plms.com or call 1800-123-4567. Want to start a live chat?",
            options: ["Start Live Chat", "Back to Main Menu"],
          };
          break;
        case "view required documents":
          response = {
            text: `Required documents for loan applications:\n${mockLoanData.requiredDocuments
              .map((doc) => `• ${doc}`)
              .join("\n")}`,
            options: ["Upload Documents", "Back to Main Menu"],
          };
          break;
        case "upload documents":
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            navigate("/upload-documents");
          }, 1500);
          response = {
            text: "Redirecting to the document upload portal...",
            options: [],
          };
          break;
        case "start live chat":
          response = {
            text: "Connecting to a support agent. Please wait a moment...",
            options: ["Back to Main Menu"],
          };
          break;
        case "back to main menu":
          response = {
            text: "How can I assist you further?",
            options: projectOptions,
          };
          break;
        default:
          if (query.toLowerCase().startsWith("loan id")) {
            const loanId = query.split(" ").slice(-1)[0].toUpperCase();
            const loan = mockLoanData.userLoans.find((l) => l.id === loanId);
            response = loan
              ? {
                  text: `Loan ID: ${loan.id}\nStatus: ${loan.status}\nEMI: ${
                    loan.emiDue || "No EMI due"
                  }`,
                  options: ["Back to Main Menu"],
                }
              : {
                  text: `Loan ID ${loanId} not found. Please check the ID or select another option.`,
                  options: ["Enter Loan ID", "Back to Main Menu"],
                };
          } else {
            response = {
              text: "Sorry, I didn't understand that. Please select an option or clarify your query.",
              options: projectOptions,
            };
          }
      }
      setMessages((prev) => [
        ...prev,
        { text: response.text, sender: "bot", options: response.options },
      ]);
    }, 1000); // Simulate typing delay
  };

  const handleOptionClick = (option) => {
    setMessages((prev) => [...prev, { text: option, sender: "user" }]);
    getBotResponse(option);
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    getBotResponse(input);
  };

  return (
    <>
      {/* Toggle Button */}
      <Tooltip title="Chat with PLMS Assistant">
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: "#1a73e8",
            color: "white",
            width: 56,
            height: 56,
            "&:hover": { backgroundColor: "#1557b0" },
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </Tooltip>

      {/* Chat Window */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            zIndex: 1000,
            width: 380,
            height: 520,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#fff",
            animation: "fadeIn 0.3s ease-out",
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "scale(0.9)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: "#1a73e8",
              color: "white",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SmartToyIcon />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              PLMS Assistant
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "#f9fafb",
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    gap: 1,
                    alignItems: "flex-end",
                  }}
                >
                  {message.sender === "bot" && (
                    <Avatar sx={{ bgcolor: "#1a73e8", width: 32, height: 32 }}>
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Paper
                    sx={{
                      padding: "10px 14px",
                      maxWidth: "75%",
                      backgroundColor:
                        message.sender === "user" ? "#1a73e8" : "#fff",
                      color: message.sender === "user" ? "white" : "black",
                      borderRadius:
                        message.sender === "user"
                          ? "16px 16px 0 16px"
                          : "16px 16px 16px 0",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
                    >
                      {message.text}
                    </Typography>
                  </Paper>
                  {message.sender === "user" && (
                    <Avatar sx={{ bgcolor: "#1a73e8", width: 32, height: 32 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
                {message.sender === "bot" && message.options && (
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {message.options.map((option, idx) => (
                      <Grid item xs={6} key={idx}>
                        <Button
                          variant="outlined"
                          onClick={() => handleOptionClick(option)}
                          sx={{
                            width: "100%",
                            textTransform: "none",
                            fontSize: "0.85rem",
                            padding: "6px 8px",
                            borderColor: "#1a73e8",
                            color: "#1a73e8",
                            "&:hover": {
                              borderColor: "#1557b0",
                              backgroundColor: "rgba(26, 115, 232, 0.04)",
                            },
                          }}
                        >
                          {option}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ bgcolor: "#1a73e8", width: 32, height: 32 }}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Paper
                  sx={{
                    padding: "10px 14px",
                    backgroundColor: "#fff",
                    borderRadius: "16px 16px 16px 0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="body2">Typing...</Typography>
                </Paper>
              </Box>
            )}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress size={24} color="primary" />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              padding: "12px",
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#fff",
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask about your loan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              size="small"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "#f1f3f4",
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              sx={{
                backgroundColor: "#1a73e8",
                color: "white",
                "&:hover": { backgroundColor: "#1557b0" },
                padding: "8px",
              }}
              disabled={loading || !input.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chatbot;
