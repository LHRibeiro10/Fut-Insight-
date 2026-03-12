import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff234f",
    },
    secondary: {
      main: "#f4d35e",
    },
    success: {
      main: "#00d084",
    },
    error: {
      main: "#ff4d4f",
    },
    warning: {
      main: "#ffb020",
    },
    background: {
      default: "#05070b",
      paper: "#10141c",
    },
    text: {
      primary: "#f5f7fb",
      secondary: "#98a2b3",
    },
    divider: "rgba(255,255,255,0.08)",
  },

  shape: {
    borderRadius: 18,
  },

  typography: {
    fontFamily: `"Inter", "Rajdhani", "Orbitron", sans-serif`,
    h1: {
      fontWeight: 900,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontWeight: 900,
      letterSpacing: "-0.03em",
    },
    h3: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 800,
    },
    h6: {
      fontWeight: 800,
    },
    body1: {
      fontFamily: `"Inter", sans-serif`,
    },
    body2: {
      fontFamily: `"Inter", sans-serif`,
    },
    button: {
      fontWeight: 800,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: "100%",
        },
        body: {
          minHeight: "100%",
          background:
            "radial-gradient(circle at top, #101723 0%, #05070b 40%, #030406 100%)",
          color: "#f5f7fb",
        },
        "#root": {
          minHeight: "100vh",
        },
        "*::-webkit-scrollbar": {
          width: 10,
          height: 10,
        },
        "*::-webkit-scrollbar-thumb": {
          background: "#2a3140",
          borderRadius: 20,
        },
        "*::-webkit-scrollbar-track": {
          background: "#0b0f15",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(145deg, rgba(19,24,35,0.98) 0%, rgba(13,17,25,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "linear-gradient(90deg, #ff234f 0%, #c9002b 100%)",
          boxShadow: "0 8px 22px rgba(255,35,79,0.35)",
        },
        containedSecondary: {
          background: "linear-gradient(90deg, #f4d35e 0%, #d6b445 100%)",
          color: "#111",
          boxShadow: "0 8px 22px rgba(244,211,94,0.25)",
        },
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 800,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: "rgba(255,255,255,0.02)",
          "& fieldset": {
            borderColor: "rgba(255,255,255,0.10)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(255,255,255,0.18)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#f4d35e",
            boxShadow: "0 0 0 3px rgba(244,211,94,0.08)",
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #920015 0%, #c9002b 45%, #7d0013 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
        },
      },
    },
  },
});

export default theme;