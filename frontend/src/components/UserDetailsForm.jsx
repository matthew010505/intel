import React, { useState } from "react";
import axios from "axios";
import Header from './Header'
import Footer from './Footer'
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  Paper,
  Radio,
  RadioGroup,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom Theme Configuration
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000", // Soft pinkish white for primary elements
    },
    secondary: {
      main: "#000", // Warm beige for secondary elements
    },
    background: {
      default: "#FEFAF6", // Light cream-pink background
      paper: "#fff", // White for paper
    },
    text: {
      primary: "#000", // Deep navy blue for primary text
      secondary: "#DAC0A3", // Light beige for secondary text
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: "1.5rem",
      color: "#000", // Deep navy blue for headings
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
      color: "#000", // Light beige for section labels
    },
  },

  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#DAC0A3", // Default unselected color
          "&.Mui-checked": {
            color: "#000", // Selected color
          },
        },
      },
    },
  },
});

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    region: "",
    classification: "",
    annualIncome: "",
    incomeSource: "",
    taxpayerStatus: "",
    educationLevel: "",
    skillset: "",
    employmentType: "",
    sector: "",
    disabilities: false,
    minorityStatus: false,
    socialCategory: "",
    currentBenefits: "",
    specificNeeds: "",
  });
  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const reset = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      region: "",
      classification: "",
      annualIncome: "",
      incomeSource: "",
      taxpayerStatus: "",
      educationLevel: "",
      skillset: "",
      employmentType: "",
      sector: "",
      disabilities: false,
      minorityStatus: false,
      socialCategory: "",
      currentBenefits: "",
      specificNeeds: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", [formData], {
        headers: { "Content-Type": "application/json" },
      });
      reset();
      console.log("Server response:", res.data[0].top_schemes);
      navigate("/dashboard", { state: { data: res.data[0].top_schemes } });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
    <Header/>
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            background: "linear-gradient(to right, #FEFAF6, 001F3F)",
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            User Details Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Personal Details
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Name (optional)"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#000" } }}
                  InputProps={{
                    style: { color: "#000" },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl component="fieldset">
                  <Typography variant="h6" sx={{ color: "#000" }}>
                    Age
                  </Typography>
                  <RadioGroup
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="below18"
                      control={<Radio />}
                      label="Below 18"
                    />
                    <FormControlLabel
                      value="18to60"
                      control={<Radio />}
                      label="18 to 60"
                    />
                    <FormControlLabel
                      value="above60"
                      control={<Radio />}
                      label="Above 60"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Gender */}
              <Grid item xs={6}>
                <FormControl component="fieldset">
                  <Typography variant="h6" sx={{ color: "#000" }}>
                    Gender
                  </Typography>
                  <RadioGroup
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{ color: "#DAC0A3" }}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Region */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Region (state, district, etc.)"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#000" } }}
                  InputProps={{
                    style: { color: "#000" },
                  }}
                />
              </Grid>

              {/* Urban/Rural */}
              <Grid item xs={6}>
                <FormControl component="fieldset">
                  <Typography variant="h6" sx={{ color: "#000" }}>
                    Urban or Rural
                  </Typography>
                  <RadioGroup
                    name="classification"
                    value={formData.classification}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="urban"
                      control={<Radio />}
                      label="Urban"
                      style={{ color: "#000" }}
                    />
                    <FormControlLabel
                      value="rural"
                      control={<Radio />}
                      label="Rural"
                      style={{ color: "#000" }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Financial Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Financial Information
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Annual Income"
                  name="annualIncome"
                  type="number"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#000" } }}
                  InputProps={{
                    style: { color: "#000" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: "#000" }}>
                    Income Source
                  </InputLabel>
                  <Select
                    name="incomeSource"
                    value={formData.incomeSource}
                    onChange={handleChange}
                    required
                    style={{ color: "000" }}
                  >
                    <MenuItem value="farmer">Farmer</MenuItem>
                    <MenuItem value="salaried">Salaried</MenuItem>
                    <MenuItem value="entrepreneur">Entrepreneur</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Taxpayer status (radio buttons) */}
              <Grid item xs={6}>
                <FormControl component="fieldset">
                  <Typography variant="h6" sx={{ color: "#000" }}>
                    Taxpayer Status
                  </Typography>
                  <RadioGroup
                    name="taxpayerStatus"
                    value={formData.taxpayerStatus}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                      style={{ color: "#000" }}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      style={{ color: "#000" }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Educational Background */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Educational Background
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: "#000" }}>
                    Education Level
                  </InputLabel>
                  <Select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    required
                    style={{ color: "001F3F" }}
                  >
                    <MenuItem value="10th">10th</MenuItem>
                    <MenuItem value="12th">12th</MenuItem>
                    <MenuItem value="graduate">Graduate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Skillset/Qualifications"
                  name="skillset"
                  value={formData.skillset}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#000" } }}
                  InputProps={{
                    style: { color: "000" },
                  }}
                />
              </Grid>

              {/* Employment Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Employment Details
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: "#000" }}>
                    Employment Type
                  </InputLabel>
                  <Select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                    style={{ color: "#000" }}
                  >
                    <MenuItem value="government">Government</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                    <MenuItem value="self-employed">Self-Employed</MenuItem>
                    <MenuItem value="unemployed">Unemployed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: "#000" }}>Sector</InputLabel>
                  <Select
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    required
                    style={{ color: "000" }}
                  >
                    <MenuItem value="agriculture">Agriculture</MenuItem>
                    <MenuItem value="it">IT</MenuItem>
                    <MenuItem value="healthcare">Healthcare</MenuItem>
                    <MenuItem value="education">Education</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Special Conditions */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Special Conditions
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.disabilities}
                      onChange={handleChange}
                      name="disabilities"
                    />
                  }
                  label="Disabilities"
                  sx={{ color: "000" }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.minorityStatus}
                      onChange={handleChange}
                      name="minorityStatus"
                    />
                  }
                  label="Minority Status"
                  sx={{ color: "001F3F" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Social Category (e.g., SC/ST/OBC)"
                  name="socialCategory"
                  value={formData.socialCategory}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#90caf9" } }}
                  InputProps={{
                    style: { color: "001F3F" },
                  }}
                />
              </Grid>

              {/* Current Benefits and Specific Needs */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Other Factors
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Current Benefits"
                  name="currentBenefits"
                  value={formData.currentBenefits}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#90caf9" } }}
                  InputProps={{
                    style: { color: "001F3F" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Specific Needs (e.g., healthcare, education loans)"
                  name="specificNeeds"
                  value={formData.specificNeeds}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#90caf9" } }}
                  InputProps={{
                    style: { color: "001F3F" },
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
    <Footer/>
    </>
  );
};

export default UserDetailsForm;
