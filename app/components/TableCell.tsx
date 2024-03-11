import React from 'react';
import { TableCell, Link, Typography } from '@mui/material';

interface LinkInfo {
  text: string;
  startIndex: number;
  endIndex: number;
}

const extractLinks = (text: string): LinkInfo[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex) || [];

  return matches.map((match, index) => ({
    text: match,
    startIndex: text.indexOf(match),
    endIndex: text.indexOf(match) + match.length,
  }));
};

interface TableCellComponentProps {
  cell: string;
  theme: any;
}

const TableCellComponent: React.FC<TableCellComponentProps> = ({ cell, theme }) => {
  const links: LinkInfo[] = extractLinks(cell);


  return (
    <TableCell align="center" style={{ border: '1px solid #ccc', padding: '10px' }}>
      {links.length > 0 ? (
        links.map((link, index) => (
          <React.Fragment key={index}>
            {index === 0 ? (
              <Typography variant="body1" color="textPrimary">
                {cell.substring(0, link.startIndex)}
              </Typography>
            ) : (
              <Typography variant="body1" color="textPrimary">
                {`${cell.substring(links[index - 1].endIndex, link.startIndex)}`}
              </Typography>
            )}
            <Link
              href={link.text}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
              }}
            >
              {link.text}
            </Link>
            {index === links.length - 1 && (
              <Typography variant="body1" color="textPrimary">
                {cell.substring(link.endIndex)}
              </Typography>
            )}
          </React.Fragment>
        ))
      ) : (
        <Typography variant="body1" color="textPrimary">
          {cell}
        </Typography>
      )}
    </TableCell>
  );
};

export default TableCellComponent;
