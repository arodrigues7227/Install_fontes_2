import React, { useState, useEffect } from "react";
import { makeStyles, TextField, Grid, Container, Button, Menu, MenuItem, ListItemText, IconButton } from "@material-ui/core";
import { Formik, Form, FastField, FieldArray } from "formik";
import { isArray } from "lodash";
import NumberFormat from "react-number-format";
import ButtonWithSpinner from "../ButtonWithSpinner";
import TrashIcon from '@material-ui/icons/Delete';
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  fullWidth: {
    width: "100%",
  },
  textfield: {
    width: "100%",
  },
  row: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  control: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  buttonContainer: {
    textAlign: "right",
    padding: theme.spacing(1),
  },
}));

const weekDaysOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

function SchedulesForm(props) {
  const { initialValues, onSubmit, loading, labelSaveButton } = props;
  const classes = useStyles();

  const [schedules, setSchedules] = useState([
    { weekday: "Segunda-feira", weekdayEn: "monday", startTime: "", endTime: "", },
    { weekday: "Terça-feira", weekdayEn: "tuesday", startTime: "", endTime: "", },
    { weekday: "Quarta-feira", weekdayEn: "wednesday", startTime: "", endTime: "", },
    { weekday: "Quinta-feira", weekdayEn: "thursday", startTime: "", endTime: "", },
    { weekday: "Sexta-feira", weekdayEn: "friday", startTime: "", endTime: "" },
    { weekday: "Sábado", weekdayEn: "saturday", startTime: "", endTime: "" },
    { weekday: "Domingo", weekdayEn: "sunday", startTime: "", endTime: "" },
  ]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddSchedule = (weekday, weekdayEn) => {
    const newSchedules = [...schedules, { weekday, weekdayEn, startTime: "", endTime: "" }];
    const sortedSchedules = newSchedules.sort((a, b) => weekDaysOrder.indexOf(a.weekdayEn) - weekDaysOrder.indexOf(b.weekdayEn));
    setSchedules(sortedSchedules);
    handleClose();
  };

  useEffect(() => {
    if (isArray(initialValues) && initialValues.length > 0) {
      setSchedules(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Formik
      enableReinitialize
      className={classes.fullWidth}
      initialValues={{ schedules }}
      onSubmit={({ schedules }) =>
        setTimeout(() => {
          handleSubmit(schedules);
        }, 500)
      }
    >
      {({ values }) => (
        <Form className={classes.fullWidth}>
          <FieldArray
            name="schedules"
            render={(arrayHelpers) => (
              <Grid spacing={4} container>
                {values.schedules.map((item, index) => {
                  return (
                    <Container key={index} style={{ display: "flex", alignItems: "center" }}>
                      <FastField
                        as={TextField}
                        label="Dia da Semana"
                        name={`schedules[${index}].weekday`}
                        disabled
                        variant="outlined"
                        style={{ marginRight: "3.2%", width: "30%" }}
                        margin="dense"
                      />
                      <FastField
                        name={`schedules[${index}].startTime`}
                      >
                        {({ field }) => (
                          <NumberFormat
                            label="Hora de Inicial"
                            {...field}
                            variant="outlined"
                            margin="dense"
                            customInput={TextField}
                            format="##:##"
                            style={{ marginRight: "3.2%", width: "30%" }}
                          />
                        )}
                      </FastField>
                      <FastField
                        name={`schedules[${index}].endTime`}
                      >
                        {({ field }) => (
                          <NumberFormat
                            label="Hora de Final"
                            {...field}
                            variant="outlined"
                            margin="dense"
                            customInput={TextField}
                            format="##:##"
                            style={{ marginRight: "3.2%", width: "30%" }}
                          />
                        )}
                      </FastField>

                      <IconButton onClick={() => arrayHelpers.remove(index)}>
                        <TrashIcon />
                      </IconButton>

                    </Container>

                  );
                })}
              </Grid>
            )}
          ></FieldArray>



          <div style={{ textAlign: "center", marginTop: "2%" }} className={classes.buttonContainer}>
            <Button variant="contained" color="primary" onClick={handleClick}>
              Adicionar Horário
            </Button>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              {[
                { weekday: "Segunda-feira", weekdayEn: "monday" },
                { weekday: "Terça-feira", weekdayEn: "tuesday" },
                { weekday: "Quarta-feira", weekdayEn: "wednesday" },
                { weekday: "Quinta-feira", weekdayEn: "thursday" },
                { weekday: "Sexta-feira", weekdayEn: "friday" },
                { weekday: "Sábado", weekdayEn: "saturday" },
                { weekday: "Domingo", weekdayEn: "sunday" },
              ].map((day) => (
                <MenuItem key={day.weekdayEn} onClick={() => handleAddSchedule(day.weekday, day.weekdayEn)}>
                  <ListItemText primary={day.weekday} />
                </MenuItem>
              ))}
            </Menu>
            <ButtonWithSpinner
              style={{ marginLeft: "10px" }}
              loading={loading}
              type="submit"
              color="primary"
              variant="contained"
            >
              {"Aplicar"}
            </ButtonWithSpinner>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SchedulesForm;
