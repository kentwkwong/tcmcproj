// import React from "react";
// import { Formik, Field, FieldArray, Form, FormikHelpers } from "formik";
// import * as Yup from "yup";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Grid,
//   Container,
//   Typography,
//   Box,
// } from "@mui/material";

// // Options for the "group" dropdown
// const groupOptions = ["", "Red", "Orange", "Yellow", "Green"];
// const genderOptions = ["Male", "Female"];

// // Yup validation schema
// const validationSchema = Yup.object({
//   kids: Yup.array()
//     .of(
//       Yup.object({
//         name: Yup.string().required("Name is required"),
//         dob: Yup.date().required("Date of birth is required").nullable(),
//         gender: Yup.string().required("Gender is required"),
//         group: Yup.string().required("Group is required"),
//       })
//     )
//     .nullable(), // Allow null in case user has no kids
// });

// interface KidFormData {
//   kids: {
//     name: string;
//     dob: string;
//     gender: string;
//     group: string;
//   }[];
// }

// const Kids = () => {
//   return (
//     <Box>
//       <Container maxWidth="sm">
//         <Typography variant="h4" gutterBottom>
//           Kids Information
//         </Typography>

//         <Formik
//           initialValues={{
//             kids: [
//               {
//                 name: "",
//                 dob: "",
//                 gender: "",
//                 group: "",
//               },
//             ],
//           }}
//           validationSchema={validationSchema}
//           onSubmit={(
//             values: KidFormData,
//             { setSubmitting }: FormikHelpers<KidFormData>
//           ) => {
//             // Here you can handle your submit logic
//             console.log("Form submitted:", values);
//             setSubmitting(false);
//           }}
//         >
//           {({
//             values,
//             handleChange,
//             handleSubmit,
//             errors,
//             touched,
//             setFieldValue,
//             isSubmitting,
//           }) => (
//             <Form onSubmit={Formik.handleSubmit}>
//               {" "}
//               {/* Properly wire handleSubmit */}
//               <FieldArray name="kids">
//                 {({ push, remove }) => (
//                   <div>
//                     {values.kids?.map((kid, index) => (
//                       <Grid container spacing={2} key={index}>
//                         <Grid size={12}>
//                           <Field
//                             name={`kids.${index}.name`}
//                             as={TextField}
//                             label="Name"
//                             fullWidth
//                             value={kid.name}
//                             onChange={handleChange}
//                             error={
//                               touched.kids?.[index]?.name &&
//                               Boolean(errors.kids?.[index]?.toString)
//                             }
//                             helperText={
//                               touched.kids?.[index]?.name &&
//                               errors.kids?.[index]?.toString
//                             }
//                           />
//                         </Grid>
//                         <Grid size={12}>
//                           <Field
//                             name={`kids.${index}.dob`}
//                             as={TextField}
//                             label="Date of Birth"
//                             type="date"
//                             fullWidth
//                             InputLabelProps={{ shrink: true }}
//                             value={kid.dob}
//                             onChange={handleChange}
//                             error={
//                               touched.kids?.[index]?.dob &&
//                               Boolean(errors.kids?.[index]?.toString)
//                             }
//                             helperText={
//                               touched.kids?.[index]?.dob &&
//                               errors.kids?.[index]?.toString
//                             }
//                           />
//                         </Grid>
//                         <Grid size={12}>
//                           <Field
//                             name={`kids.${index}.gender`}
//                             as={TextField}
//                             label="Gender"
//                             select
//                             fullWidth
//                             value={kid.gender}
//                             onChange={handleChange}
//                             error={
//                               touched.kids?.[index]?.gender &&
//                               Boolean(errors.kids?.[index]?.toString)
//                             }
//                             helperText={
//                               touched.kids?.[index]?.gender &&
//                               errors.kids?.[index]?.toString
//                             }
//                           >
//                             {genderOptions.map((gender, idx) => (
//                               <MenuItem key={idx} value={gender}>
//                                 {gender}
//                               </MenuItem>
//                             ))}
//                           </Field>
//                         </Grid>
//                         <Grid size={12}>
//                           <Field
//                             name={`kids.${index}.group`}
//                             as={TextField}
//                             label="Group"
//                             select
//                             fullWidth
//                             value={kid.group}
//                             onChange={handleChange}
//                             error={
//                               touched.kids?.[index]?.group &&
//                               Boolean(errors.kids?.[index]?.toString)
//                             }
//                             helperText={
//                               touched.kids?.[index]?.group &&
//                               errors.kids?.[index]?.toString
//                             }
//                           >
//                             {groupOptions.map((group, idx) => (
//                               <MenuItem key={idx} value={group}>
//                                 {group}
//                               </MenuItem>
//                             ))}
//                           </Field>
//                         </Grid>
//                         {values.kids.length > 1 && (
//                           <Grid size={12}>
//                             <Button
//                               variant="outlined"
//                               color="error"
//                               onClick={() => remove(index)}
//                             >
//                               Remove Kid
//                             </Button>
//                           </Grid>
//                         )}
//                       </Grid>
//                     ))}

//                     <Button
//                       variant="outlined"
//                       onClick={() =>
//                         push({
//                           name: "",
//                           dob: "",
//                           gender: "",
//                           group: "",
//                         })
//                       }
//                     >
//                       Add Kid
//                     </Button>
//                   </div>
//                 )}
//               </FieldArray>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 fullWidth
//                 sx={{ mt: 3 }}
//                 disabled={isSubmitting} // Disable the submit button when form is submitting
//               >
//                 Submit
//               </Button>
//             </Form>
//           )}
//         </Formik>
//       </Container>
//     </Box>
//   );
// };

// export default Kids;
