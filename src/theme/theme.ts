import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#660064"
        },
        secondary: {
            main: "#FB710E"
        },
        background: {
            default: "#1C211E",
            paper: "#303633"
        },
        text: {
            primary: "#F7F7F3",
            secondary: "#C6C6A9",
        }
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
        ].join(","),
    }

})

export default theme