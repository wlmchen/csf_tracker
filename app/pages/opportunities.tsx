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
import Link from 'next/dist/client/link';
import { useTheme } from "@mui/system";
import TableCellComponent from '../components/TableCell';

// pages/index.tsx


type SheetData = {
  name: string;
};

const headers = ['Organization', 'Opportunity', 'Service Hours', 'Links', 'Comments & More Info'];
const SheetPage: React.FC = () => {
const [data, setData] = useState<string[][]>([]);
const url = "/api/sheet";
const theme = useTheme();

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
      <Box mt={2} style={{ marginTop: '30px', marginBottom: '20px' }}>
        <Typography variant="h4">Opportunities</Typography>
      </Box>
      <Box mt={2}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
      <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} align="center" style={{ border: '1px solid #ccc', padding: '10px', fontWeight: 'bold' }}>
                <Typography variant="h6" color="textPrimary">{header}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCellComponent key={cellIndex} cell={cell} theme={theme} />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </Paper>
    </Box>
    </Container>
    </>
  );

};

export default SheetPage;
