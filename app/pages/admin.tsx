import MaterialTable, { Column } from "@material-table/core";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Header from "../components/Header";

const validateEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

const EDITABLE_COLUMNS: Column<Hour>[] = [
  {
    field: "date",
    title: "Date",
    type: "date",
    defaultSort: "desc",
    // validate: (rowData) =>
    //   (rowData.date || "") instanceof Date && !isNaN(rowData.date || ""),
  },
  {
    field: "hours",
    title: "Hours",
    type: "numeric",
    validate: (rowData) => (rowData.hours || 0) > 0,
  },
  {
    field: "name",
    title: "Name of Activity",
    validate: (rowData) => (rowData.name || "").length > 0,
  },
  {
    field: "description",
    title: "Description of Activity",
    sorting: false,
    validate: (rowData) => (rowData.description || "").length > 0,
  },
  {
    field: "supervisor_name",
    title: "Supervisor Name",
    validate: (rowData) => (rowData.supervisor_name || "").length > 0,
  },
  {
    field: "supervisor_contact",
    title: "Supervisor Email",
    sorting: false,
    validate: (rowData) => validateEmail(rowData.supervisor_contact || ""),
  },
  {
    field: "approved",
    title: "Approved",
    type: "boolean",
    initialEditValue: true,
  },
];

export default function Admin() {
  const [data, setData] = useState<User[]>([]);

  function editable(member: User) {
    return {
      onRowAdd: (newData: Hour) => {
        return new Promise<void>((resolve, reject) => {
          fetch(`/api/admin/${member.id}`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(newData),
            headers: {
              "content-type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setData(data);
              resolve();
            })
            .catch((error) => {
              reject();
            });
        });
      },
      onRowDelete: (oldData: Hour) => {
        return new Promise<void>((resolve, reject) => {
          fetch(`/api/admin/${oldData.id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              setData(data);
              resolve();
            })
            .catch((error) => {
              console.log(error);
            });
        });
      },
      onRowUpdate: (newData: Hour, oldData: any) => {
        return new Promise<void>((resolve, reject) => {
          fetch(`/api/admin/${oldData.id}`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(newData),
            headers: {
              "content-type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setData(data);
              resolve();
            })
            .catch((error) => {
              reject();
            });
        });
      },
    };
  }

  useEffect(() => {
    fetch(`/api/admin/hours`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Box component="main" sx={{ p: 3 }}>
          {data ? (
            data.map((member) => (
              <Accordion disableGutters={true} key={member.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    {member.name}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {member.hours
                      .filter((hour) => hour.approved)
                      .reduce((total, obj) => obj.hours + total, 0)}{" "}
                    Approved Hours,{" "}
                    {member.hours
                      .filter((hour) => !hour.approved)
                      .reduce((total, obj) => obj.hours + total, 0)}{" "}
                    Pending Hours
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <MaterialTable
                    data={member.hours.filter(
                      (hour) => hour.approved === false
                    )}
                    columns={EDITABLE_COLUMNS}
                    options={{
                      rowStyle: { fontFamily: "Roboto", fontSize: "0.875rem" },
                      search: false,
                      actionsColumnIndex: -1,
                      pageSize: 5,
                      pageSizeOptions: [5, 10],
                    }}
                    title="Pending Hours"
                    editable={editable(member)}
                  />
                  <MaterialTable
                    style={{ marginTop: "1em" }}
                    data={member.hours.filter((hour) => hour.approved === true)}
                    columns={EDITABLE_COLUMNS}
                    options={{
                      rowStyle: { fontFamily: "Roboto", fontSize: "0.875rem" },
                      search: false,
                      actionsColumnIndex: -1,
                      pageSize: 5,
                      pageSizeOptions: [5, 10],
                    }}
                    title="Approved Hours"
                    editable={editable(member)}
                  />
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Skeleton variant="rectangular" />
          )}
        </Box>
      </Container>
    </>
  );
}
