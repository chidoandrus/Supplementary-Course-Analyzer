import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TablePagination,
  TextField,
} from "@mui/material";
import DefaultLayout from "../../components/default/layout";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { courses } from "../../courses";

const CourseTimeAnalyzer = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingRow, setEditingRow] = useState(null);
  const [editedSlot, setEditedSlot] = useState({});

  const handleSearch = () => {
    const filtered = timeSlots.filter(
      (slot) =>
        slot.days.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.timeSlot.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTimeSlots(filtered);
    setPage(0);
  };

  useEffect(() => {
    const analyzeCourses = () => {
      const slots = {};

      courses.forEach((course) => {
        const { days, time, students, semester = 1, year = "2024-25" } = course;
        const key = `${days} ${time} ${semester} ${year}`;

        if (!slots[key]) {
          slots[key] = { days, timeSlot: time, students: 0, semester, year };
        }

        slots[key].students += students;
      });

      const timeSlotsArray = Object.values(slots);
      setTimeSlots(timeSlotsArray);
      setFilteredTimeSlots(timeSlotsArray);
    };

    analyzeCourses();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (index) => {
    setEditingRow(index);
    setEditedSlot(filteredTimeSlots[index]);
  };

  const handleSaveClick = (index) => {
    const updatedTimeSlots = [...filteredTimeSlots];
    updatedTimeSlots[index] = editedSlot;
    setFilteredTimeSlots(updatedTimeSlots);
    setEditingRow(null);
  };

  const handleInputChange = (field, value) => {
    setEditedSlot((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DefaultLayout>
      <Stack p={3} spacing={2}>
        <Card sx={{ p: 1 }}>
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: {
                xs: "100%",
                md: "300px",
              },
            }}
            variant="outlined"
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                handleSearch();
              }
            }}
            label="Search Time Slots"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="search"
                    onClick={handleSearch}
                    sx={{
                      backgroundColor: "#e0e0e0",
                      height: "40px",
                      width: "40px",
                      borderRadius: "5px",
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Card>
        <Card sx={{ p: 1 }}>
          <Grid container>
            <Table>
              <TableBody>
                {filteredTimeSlots
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((slot, index) => (
                    <React.Fragment key={index}>
                      <TableRow style={{ height: "20px" }}>
                        <TableCell
                          colSpan={6}
                          style={{ border: "none", padding: 0 }}
                        ></TableCell>
                      </TableRow>
                      <TableRow
                        style={{
                          backgroundColor: "#333333",
                        }}
                      >
                        <TableCell style={{ color: "#fff" }}>Day(s)</TableCell>
                        <TableCell style={{ color: "#fff" }}>Time(s)</TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          # of Students
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>Semester</TableCell>
                        <TableCell style={{ color: "#fff" }}>Year</TableCell>
                        <TableCell style={{ color: "#fff" }}>Actions</TableCell>
                      </TableRow>
                      <TableRow style={{ backgroundColor: "#eae9e8" }}>
                        <TableCell>
                          {editingRow === index ? (
                            <TextField
                              value={editedSlot.days}
                              onChange={(e) =>
                                handleInputChange("days", e.target.value)
                              }
                            />
                          ) : (
                            slot.days
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <TextField
                              value={editedSlot.timeSlot}
                              onChange={(e) =>
                                handleInputChange("timeSlot", e.target.value)
                              }
                            />
                          ) : (
                            slot.timeSlot
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <TextField
                              value={editedSlot.students}
                              onChange={(e) =>
                                handleInputChange("students", e.target.value)
                              }
                            />
                          ) : (
                            slot.students
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <TextField
                              value={editedSlot.semester}
                              onChange={(e) =>
                                handleInputChange("semester", e.target.value)
                              }
                            />
                          ) : (
                            slot.semester
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <TextField
                              value={editedSlot.year}
                              onChange={(e) =>
                                handleInputChange("year", e.target.value)
                              }
                            />
                          ) : (
                            slot.year
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <IconButton
                              aria-label="save"
                              onClick={() => handleSaveClick(index)}
                            >
                              <SaveIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleEditClick(index)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
            <Grid item xs={12}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredTimeSlots.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </Card>
      </Stack>
    </DefaultLayout>
  );
};

export default CourseTimeAnalyzer;
