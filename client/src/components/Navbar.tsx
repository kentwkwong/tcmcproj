import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);
  const handleMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Profile", path: "/profile" },
    { label: "About", path: "/about" },
  ];

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              sx={{ display: { sm: "none" } }}
              onClick={toggleDrawer(drawerOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ color: "white", textDecoration: "none" }}
            >
              TCMC Portal
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                color="inherit"
                component={Link}
                to={link.path}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {!user ? (
            // <GoogleLogin
            //   onSuccess={(response) => {
            //     console.log("test cp1");
            //     handleLogin(response);
            //     console.log("test cp2");
            //     console.log(response.credential);
            //   }}
            //   onError={() => console.error("Login Failed")}
            // />
            <Box></Box>
          ) : (
            <Box>
              <IconButton onClick={handleMenu}>
                <Avatar src={user.picture} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    logout();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {
        // <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        //   <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
        //     <List>
        //       {navLinks.map((link) => (
        //         <ListItem
        //           button
        //           component={Link}
        //           to={link.path}
        //           key={link.path}
        //         >
        //           <ListItemText primary={link.label} />
        //         </ListItem>
        //       ))}
        //       {user && (
        //         <ListItem button onClick={logout}>
        //           <ListItemText primary="Logout" />
        //         </ListItem>
        //       )}
        //     </List>
        //   </Box>
        // </Drawer>
      }
    </>
  );
};

export default Navbar;
