import React, { useState, useEffect, useReducer } from 'react';
import basestyle from "../Base.module.css";
import { useNavigate, NavLink } from "react-router-dom";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro' 

import {
  Container,
  Grid,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
} from "@mui/material";

import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { maxWidth } from '@mui/system';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'submit':
//       return { 
        
//       };
//     default:
//       throw new Error();
//   }
// };

const steps = ['Select campaign settings', 'Create an ad group', 'Criteria'];

const styles = {
  primaryBackgroundColor: {
    backgroundColor: 'rgb(103, 58, 183)', 
  },
  formHeader: {
    padding: '30px 15px'
  },
  formCard: {
    backgroundColor: '#fff',
    padding: '22px 24px',
    borderRadius: '.5em',
  },
  formHeaderTopCard: {
    backgroundColor: '#fff', 
    borderRadius: '.5em .5em .5em .5em',
  },
  formHeaderTopCardWithBaner: {
    backgroundColor: '#fff', 
    borderRadius: '0 0 .5em .5em',
  },
  formSubCard: {
    padding: '22px 24px',
  },
  marBtm20: {
    marginBottom: '20px'
  },
  marTop20: {
    marginTop: '20px'
  },
  formInput: {
    width: '100%',
  },
  formHeaderBar: {
    backgroundColor: 'rgb(103, 58, 183)', 
    borderRadius: '.5em .5em 0 0', 
    padding: '.3em', 
    color: '#fff'
  }
}

function CriteriaElement() {
  var i_arr = [0,1,2,3,4,5,6,7,8,9,10];
  return i_arr.map((idx) => (
     <FormControlLabel value={idx} control={<Radio />} label={idx} labelPlacement="top" sx={{margin: '0px'}}/>
  ))
}

const Profile = ({ setUserState, username }) => {

  const navigate = useNavigate();

  const u_name = JSON.parse(localStorage.getItem('user_info')).username;
  const pageTitle = "Evaluation form";

  const [criteriaID, setCriteriaID] = useState(0);
  const [delCriteriaID, setDelCriteriaID] = useState(-1);

  const [mainDeps, setMainDeps] = useState([]);
  const [subDeps, setSubDeps] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [criteriaCount, setCriteriaCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    evaManager: '',
    mainDepart: '',
    subDepart: '',
    chefName: '',
    criteriaTitle: '',
    criteriaGrade: '',
    criteria: [],
  });

  const [errors, setErrors] = useState({
    evaManager: '',
    mainDepart: '',
    subDepart: '',
    chefName: '',
    criteriaTitle: '',
    criteriaGrade: '',
    criteria: [],
  });
  const [activeStep, setActiveStep] = useState(0);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

   const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    axios.post("/api/user/updateCriteria", 
      { 
        userId: formData.chefName, 
        criteria: JSON.stringify(formData.criteria),
      }).then((res) => {
        console.log(res);
        setFormData({
          evaManager: '',
          mainDepart: '',
          subDepart: '',
          chefName: '',
          criteriaTitle: '',
          criteriaGrade: '',
          criteria: [],
        });
        setActiveStep(0);
        navigate("/", { replace: true });
    });
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };


  // Get All Main Department data from Backend
  function getAllMainDeps() {
    axios.get("/api/main_deps").then((res) => {
      setMainDeps(res.data);
    });
  }
  
  // Get All Sub Department data from Backend
  function getAllSubDeps() {
    axios.get("/api/sub_deps").then((res) => {
      setSubDeps(res.data);
    });
  }

  // Get All Employee data from Backend
  function getAllEmployees() {
    axios.get("/api/employees").then((res) => {
      setEmployees(res.data);
    });
  }

  // Add Criteria to Form
  function addCriteria() {

    const newCriterias = [...formData.criteria];

    const new_criteria = {
      rec_num: criteriaID,
      title: formData.criteriaTitle,
      emp_id: formData.chefName,
      grade: 0,
    }
    newCriterias.push(new_criteria);

    // setFormData([ ...formData.criteria, newCriterias ]);
    setFormData({ ...formData, criteria: newCriterias });
  }

  function handleCriteriaChange(idx, grade) {
    const newCriterias = [...formData.criteria];
    newCriterias[idx].grade = grade;
    setFormData({ ...formData, criteria: newCriterias });
  }

  function deleteCriteria(idx) {
    
    const newCriterias = [...formData.criteria];
    newCriterias.splice(idx, 1);
    setFormData({ ...formData, criteria: newCriterias });

  }

  useEffect(() => {
    getAllMainDeps();
    getAllSubDeps();
    getAllEmployees();
  }, [mainDeps, subDeps, employees]);

  useEffect(() => {
    const { evaManager, mainDepart, subDepart, chefName, criteria, criteriaTitle, criteriaGrade } = formData;
    setErrors({
      evaManager: evaManager.toString().trim() === '' ? 'First name is required' : '',
      mainDepart: mainDepart.toString().trim() === '' ? 'Restaurant name is required' : '',
      subDepart: subDepart.toString().trim() === '' ? 'Room name is required' : '',
      chefName: chefName.toString().trim() === '' ? 'name is required' : '',
      criteriaTitle: criteriaTitle.toString().trim() === '' ? 'criteriaTitle is required' : '',
      criteriaGrade: criteriaGrade.toString().trim() === '' ? 'criteriaGrade is required' : '',
    });
  }, [formData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (
    <div sx={{ mt: 10, width: '100%', maxWidth: '800px' }}>
        <Box style={styles.formHeaderTopCard}>
          <div style={styles.formHeaderBar}></div>
          <Typography variant="h4" style={{...styles.formSubCard}}>{pageTitle}</Typography>
          <Stepper activeStep={activeStep} style={{...styles.formHeader, ...styles.formSubCard, padding: '5px 24px'}}>
            {steps.map((label) => (
              <Step key={label} style={{paddingBottom: "20px",}}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography variant="h6" style={{padding: '0 0 20px 20px', fontSize: '15px'}}>* Required</Typography>
        </Box>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item style={{width: '100%'}}>
            {activeStep === 0 && (
              <Box style={styles.marTop20}>
                <Box style={{ ...styles.formCard, ...styles.marBtm20 }}>
                  <Typography marginBottom='20px'>Evaluation manager</Typography>
                  <FormControl sx={{width: '50%'}}>
                    <Typography style={{paddingLeft: '10px', marginBottom: '10px'}}>Welcome {u_name}</Typography>
                  </FormControl>
                </Box>
                <Box style={styles.formCard}>
                  <Typography marginBottom={'20px'}>Restaurant section</Typography>
                  <FormControl sx={{width: '50%'}}>
                    <InputLabel error={errors.mainDepart !== ''} id="demo-simple-select-label">Restaurant section</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="mainDepart"
                      value={formData.mainDepart}
                      label="Restaurant section"
                      onChange={handleInputChange}
                      error={errors.mainDepart !== ''}
                    >
                      {
                        mainDeps && mainDeps.map((mainDep) => (
                          <MenuItem key={mainDep._id} value={mainDep._id}>{mainDep.name}</MenuItem>
                        ))
                      }
                      
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
            {activeStep === 1 && (
              <>
                {/* SELECT SUB DEPARTMENT */}
                <Box style={{...styles.formCard, ...styles.marBtm20, marginTop: '20px'}}>
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Sections *</FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="subDepart"
                      value={formData.subDepart}
                      onChange={handleInputChange}
                      error={errors.subDepart !== ''}
                    >
                      {
                        subDeps && subDeps.filter((subDep) => {
                          return subDep.main_dep_id._id == formData.mainDepart
                        }).map((subDep) => (
                          <FormControlLabel key={subDep._id} value={subDep._id} control={<Radio />} label={subDep.name} />
                        )) 
                      }
                      
                    </RadioGroup>
                  </FormControl>
                </Box>
              </>
            )}
            {activeStep === 2 && (
              <>
                {/* SELECT EMPLOYEE NAME AND CHOOSE CRITERIAS DYNAMICALLY */}
                <Box style={{...styles.formCard, ...styles.marBtm20, marginTop: '20px'}} >
                  <FormControl sx={{width: '50%'}}>
                    <InputLabel error={errors.chefName !== ''} id="demo-simple-select-label">Chief name</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="chefName"
                      value={formData.chefName}
                      label="Restaurant section"
                      onChange={handleInputChange}
                      error={errors.chefName !== ''}
                    >
                    {
                      employees && employees.filter((emp) => {
                        return emp.sub_dep_id._id == formData.subDepart
                      }).map((emp) => (
                        <MenuItem key={emp._id} value={emp._id}>{emp.name}</MenuItem>
                      )) 
                    }
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <Icon baseClassName="fas" className="fa-plus-circle" />
                  <Box style={{...styles.formHeaderBar, padding: '10px 15px', display: 'flex', justifyContent: 'space-between'}}>
                    <FormLabel style={{margin: 'auto', color: '#fff', marginLeft: '0px'}} id="demo-form-control-label-placement">Criterias</FormLabel>
                    <IconButton onClick={ handleClickOpen } style={{margin: 'auto 0px auto auto', width: '30px', height: '30px', color: '#fff', display: 'flex'}} aria-label="plus" size="large">
                      <span>+</span>
                    </IconButton>
                  </Box>
                  <Box style={{...styles.formHeaderTopCardWithBaner, ...styles.marBtm20, padding: '20px 10px'}}>
                    {
                      formData.criteria && formData.criteria.map((criteria, idx) => (
                        <Box key={idx} style={{display: 'flex', padding: '10px 15px'}}>
                          <FormLabel id="demo-form-control-label-placement" style={{margin: 'auto 5px'}}>Bad</FormLabel>
                          <FormControl>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                              <FormLabel style={{margin: 'auto', marginLeft: '0px'}} id="demo-form-control-label-placement">{criteria.title} *</FormLabel>
                              <IconButton  style={{margin: '-5px -60px auto auto'}} aria-label="delete" size="small">
                                <DeleteIcon onClick={ e => deleteCriteria(idx) } fontSize="inherit" />
                              </IconButton>
                            </div>
                            <RadioGroup
                              row
                              aria-labelledby="demo-form-control-label-placement"
                              name="criteriaGrade"
                              id={idx}
                              value={criteria.grade}
                              onChange={e => handleCriteriaChange(idx, e.target.value)}
                              defaultValue="0"
                              sx={{display: 'flex'}}
                            >
                              <CriteriaElement />
                            </RadioGroup>
                          </FormControl>
                          <FormLabel id="demo-form-control-label-placement" style={{margin: 'auto 5px'}}>Good</FormLabel>
                        </Box>
                      ))
                    }
                  </Box>
                </Box>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Add criteria item</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Type the title of Criteria.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="criteria_title"
                      label="Criteria Title"
                      type="criteria_title"
                      value={formData.criteriaTitle}
                      name="criteriaTitle"
                      onChange={handleInputChange}
                      fullWidth
                      variant="standard"
                      error={errors.criteriaTitle !== ''}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addCriteria}>Add</Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Grid>
          <Grid item xs={12} sx={{width: '100%'}}>
            {activeStep === 0 && (
              <Button
              variant="contained"
              color="primary"
              onClick={ handleNext }
              style={{...styles.primaryBackgroundColor, margin: 'auto', marginLeft: '0px'}}>
                Next
              </Button>
            )}
            {activeStep === 1 && (
              <>
                <Button
                variant="contained"
                color="primary"
                onClick={ handleBack }
                style={{...styles.primaryBackgroundColor, margin: 'auto', marginLeft: '0px'}}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  sx={{ marginLeft: 8 }}
                >
                  Next
                </Button>
              </>
            )}
            {activeStep === 2 && (
              <>
                <Button
                variant="contained"
                color="primary"
                onClick={ handleBack }
                style={{...styles.primaryBackgroundColor, margin: 'auto', marginLeft: '0px'}}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleFinish}
                  sx={{ marginLeft: 8 }}
                >
                  Submit
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </div>
  );
};
export default Profile;
