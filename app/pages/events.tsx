import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import MaterialTable, { Column } from "@material-table/core";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import {
  CardContent,
  Checkbox,
  LinearProgress,
  Tooltip,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
// import { headers } from 'next/dist/client/components/headers';
import Paper from '@mui/material/Paper';
// pages/index.tsx


type SheetData = {
  name: string;
};

const headers = ['Organization', 'Opportunity', 'Service Hours', 'Links', 'Comments & More Info'];
const SheetPage: React.FC = () => {
const [data, setData] = useState<string[][]>([]);
const url = (process.env.SERVER_URL || "http://localhost:3000") + "/api/sheet";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <>
    <Header/>
    <Container>
      <Box mt={2} style={{ padding: '20px' }}>
        <Typography variant="h4">Events</Typography>
      </Box>
      <Box mt={2}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index} align="center" style={{ border: '1px solid #ccc', padding: '10px', fontWeight: 'bold' }}>
                    <Typography variant="h6">{header}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} align="center" style={{ border: '1px solid #ccc', padding: '10px' }}>
                      <Typography variant="body1">{cell}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
      {/* <Box mt={2}>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <TableContainer>
            <Table>
                <TableHead>
                <TableRow>
                    {headers.map((header, index) => (
                    <TableCell key={index} align="center" style={{ border: '1px solid #ccc', padding: '10px', fontWeight: 'bold' }}>
                        {header}
                    </TableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex} align="center" style={{ border: '1px solid #ccc', padding: '10px' }}>
                        {cell}
                        </TableCell>
                    ))}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Paper>
        </Box> */}
      {/* <Box mt={2}>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            {data.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
                {row.map((item, columnIndex) => (
                <div key={columnIndex} style={{ padding: '10px', flex: 1, textAlign: 'center', borderRight: '1px solid #ccc' }}>
                    {item}
                </div>
                ))}
            </div>
            ))}
        </Paper>
        </Box> */}

      {/* <Box mt={2}>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            {data.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
                {row.map((item, columnIndex) => (
                <div key={columnIndex} style={{ padding: '10px', flex: 1 }}>
                    {item}
                </div>
                ))}
            </div>
            ))}
        </Paper>
        </Box> */}

      {/* <Box mt={2}>
        {data.map((row, rowIndex) => (
            <Paper key={rowIndex} elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #ccc', padding: '10px' }}>
                {row.map((item, columnIndex) => (
                <div key={columnIndex} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                    {item}
                </div>
                ))}
            </div>
            </Paper>
        ))}
        </Box> */}

      {/* <Box mt={2}>
        {data.map((row, rowIndex) => (
          <Paper key={rowIndex} elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            {row.map((item, columnIndex) => (
              <div key={columnIndex}>{item}</div>
            ))}
          </Paper>
        ))}
      </Box> */}
    </Container>
    </>
  );

};

export default SheetPage;