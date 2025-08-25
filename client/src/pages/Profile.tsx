// import { useAuth } from "../context/AuthContext";

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   List,
//   ListItem,
//   ListItemText,
//   Box,
// } from "@mui/material";
// import { Profile } from "../types/Parents";
// import axios from "../api/axios";
// import { Kid } from "../types/Kid";

// const Profile = (data: Profile) => {
//   const { user } = useAuth();
//   const [kids, setKids] = useState<Kid[]>([]);
//   const fetchKids = async () => {
//     const res = await axios.get<Kid[]>("/kids", {
//       params: {
//         email: user?.email,
//       },
//     });
//     setKids(res.data);
//   };

//   const [profile, setProfile] = useState<Profile | null>(null);
//   const fetchProfile = async () => {
//     const res = await axios.get<Profile>("/profile", {
//       params: {
//         email: user?.email,
//       },
//     });
//     setProfile(res.data);
//   };

//     useEffect(() => {
//       fetchKids();
//       fetchProfile();
//     }, []);

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Family Dashboard
//       </Typography>

//       <Card variant="outlined" sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6">Email</Typography>
//           <Typography>{data.email}</Typography>
//         </CardContent>
//       </Card>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//           {renderParent("mom", data.mom)}
//         </Grid>
//         <Grid item xs={12} md={6}>
//           {renderParent("dad", data.dad)}
//         </Grid>
//       </Grid>

//       <Card variant="outlined">
//         <CardContent>
//           <Typography variant="h6">Kids</Typography>
//           {data.kids.length > 0 ? (
//             <List>
//               {data.kids.map((kid, index) => (
//                 <ListItem key={index}>
//                   <ListItemText primary={`Kid ${index + 1}: ${kid}`} />
//                 </ListItem>
//               ))}
//             </List>
//           ) : (
//             <Typography>No kids listed</Typography>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// // const Dashboard = () => {
// //   const { user, logout } = useAuth();

// //   return (
// //     <div className="p-4">
// //       <h1>Dashboard</h1>
// //       <p>Welcome, {user?.name}</p>
// //       <p>Your email: {user?.email}</p>
// //       {/* <img src={user?.picture} alt="avatar" width={80} /> */}
// //       <button onClick={logout} className="mt-4">
// //         Logout
// //       </button>
// //     </div>
// //   );
// // };

// export default Profile;
