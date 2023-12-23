import { Grid, Typography } from "@material-ui/core";
import { useTheme } from "@/lib/theme.context";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

export default function Forgot() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const [values, setValues] = useState({
    email: "",
  });

  const handleChange = (prop: any) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    fetch(`/api/pwreset/request`, {
      method: "POST",
      body: JSON.stringify({
        email: values.email
      }),
      headers: {
        "content-type": "application/json",
      }
    }).then((resp) => {
      if (!resp.ok) setMessage("Invalid token");
      else {
        setMessage("Email sent")
      }
      setLoading(false);
    });
  };

  return (
    <Grid style={{ marginTop: "3em" }}>
      <Grid
        item
        container
        xs={12}
        sm={6}
        md={4}
        style={{ margin: "auto" }}
        spacing={2}
        direction="column"
      >
        <Typography variant="h5">Forgot Password</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <EmailIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              variant="standard"
              fullWidth
            />
          </Box>
          <Typography variant="h6" color="primary" align="center">
            {message}
          </Typography>
          <br />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 0, px: "32px", py: "10px" }}
          >
            Request Reset
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}
