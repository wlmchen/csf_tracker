import { NextPage } from 'next';
import { Container, Typography, Grid, Paper } from '@mui/material';
import Header from "../components/Header";
import Box from "@mui/material/Box";
import Link from '@material-ui/core/Link';
import EmailIcon from '@mui/icons-material/Email';

interface Officer {
  name: string;
  position: string;
  contact: string;
}

interface TechTeam {
  name: string;
  position: string;
  contact: string;
}

const officers: Officer[] = [
  { name: 'Ridhima Motewar', position: 'President', contact:'ridhimamotewar@gmail.com' },
  { name: 'Ria Vakharia', position: 'Vice President', contact:'ria.vakharia@gmail.com' },
  { name: 'Srinitha Sridharan', position: 'Secretary', contact:'srinithasridharan2007@gmail.com'},
  { name: 'Tiffany Liu', position: 'Volunteer Project Coordinator', contact:'tiffanyliu088@gmail.com' },
];

const techteam: TechTeam[] = [
  { name: 'William Chen', position: 'Tech Team', contact:'williamchen102@gmail.com'},
  { name: 'Kaival Shah', position: 'Tech Team', contact:'kaival.s.shah@gmail.com' },
];

const About: NextPage = () => {
  return (
    <>
    <Header/>
    <Container>
        <Box mt={2} style={{ marginTop: '30px', marginBottom: '20px' }}>
            <Typography variant="h4">About California Scholarship Federation (CSF)</Typography>
        </Box>
      <Typography variant="body1" paragraph>
      The California Scholarship Federation is a nonprofit organization dedicated to recognizing and encouraging community service and academic achievement in middle and high school students. It emphasizes service to others in one's community while promoting pride in scholastic achievement. QLS CSF's core mission is to spread the ideals of civic engagement within the Quarry Lane community. We strive to transform students into socially aware leaders who take steps to spread compassion and altruism. By awarding students for completing a certain amount of volunteering hours, we encourage students to engage with their community in ways that interest them. Our diverse volunteering opportunities, ranging from online to in-person in various fields, allow students to use their passions for the betterment of society.
      </Typography>
      <Box mt={2} style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Meet Our Officers
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {officers.map((officer, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} style={{ padding: '16px', position: 'relative' }}>
              <Typography variant="h6">{officer.name}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {officer.position}
              </Typography>
              <Link href={`mailto:${officer.contact}`} style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                <EmailIcon />
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box mt={2} style={{ marginTop: '30px', marginBottom: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Tech Team
        </Typography>
      </Box>
        <Grid container spacing={2}>
          {techteam.map((tech, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper elevation={3} style={{ padding: '16px', position: 'relative' }}>
                <Typography variant="h6">{tech.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {tech.position}
                </Typography>
                <Link href={`mailto:${tech.contact}`} style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                  <EmailIcon />
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default About;
