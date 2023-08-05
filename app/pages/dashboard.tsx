import MaterialTable, { Column } from "@material-table/core";
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
    validate: (rowData) => {
      return rowData.date != null && rowData.date !== undefined;
    },
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
];

const REQUIRED_HOURS = 10;

export default function Dashboard() {
  const [data, setData] = useState<Hour[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const response = await fetch(
        `/api/hours`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const hours = await response.json();
      console.log(hours);
      setData(hours);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    setTotalHours(getTotalHours());
    console.log(getTotalHours());
  }, [data]);

  function getHours(approved: boolean) {
    return data.filter((hour) => hour.approved === approved);
  }

  function getTotalHours() {
    return getHours(true).reduce((total, obj) => obj.hours + total, 0);
  }

  function normalize(hours: number) {
    if (hours > REQUIRED_HOURS) {
      return REQUIRED_HOURS;
    }
    return hours;
  }

  return (
    <>
      <Header />
      <Container>
        <Box component="main" sx={{ p: 3 }}>
          <Card sx={{ minWidth: 275, marginTop: 2, marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(normalize(totalHours) / REQUIRED_HOURS) * 100}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginTop: 1 }}
              >
                {totalHours}/{REQUIRED_HOURS} (
                {(totalHours / REQUIRED_HOURS) * 100}%)
              </Typography>
            </CardContent>
          </Card>
          <MaterialTable
            data={data.filter((hour) => hour.approved === false)}
            isLoading={isLoading}
            columns={EDITABLE_COLUMNS}
            options={{
              rowStyle: { fontFamily: "Roboto", fontSize: "0.875rem" },
              search: false,
              actionsColumnIndex: -1,
              pageSize: 5,
              pageSizeOptions: [5, 10],
            }}
            title="Pending Hours"
            editable={{
              onRowAddCancelled: (rowData) =>
                console.log("Row adding cancelled"),
              onRowUpdateCancelled: (rowData) =>
                console.log("Row editing cancelled"),
              onRowAdd: (newData) => {
                return new Promise<void>((resolve, reject) => {
                  fetch(`/api/hour`, {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(newData),
                    headers: {
                      "content-type": "application/json",
                    },
                  })
                    .then((response) => response.json())
                    .then((newHour) => {
                      console.log(newHour);
                      setData([...data, newHour]);
                      resolve();
                    })
                    .catch((error) => {
                      reject();
                    });
                });
              },
              onRowDelete: (oldData) => {
                return new Promise<void>((resolve, reject) => {
                  fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/hour/${oldData.id}`,
                    {
                      method: "DELETE",
                      credentials: "include",
                    }
                  )
                    .then((response) => {
                      if (response.ok)
                        setData((prevData) =>
                          prevData.filter((el) => el.id != oldData.id)
                        );
                      resolve();
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                });
              },
            }}
          />
          <MaterialTable
            style={{ marginTop: "1em" }}
            data={data.filter((hour) => hour.approved === true)}
            isLoading={isLoading}
            columns={EDITABLE_COLUMNS}
            options={{
              rowStyle: { fontFamily: "Roboto", fontSize: "0.875rem" },
              search: false,
              actionsColumnIndex: -1,
              pageSize: 5,
              pageSizeOptions: [5, 10],
            }}
            title="Approved Hours"
          />
        </Box>
      </Container>
    </>
  );
}
