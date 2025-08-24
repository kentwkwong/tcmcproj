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

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(!open);
  const handleMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Profile", path: "/profile" },
    { label: "About", path: "/about" },
    { label: "CheckIn", path: "/checkin" },
  ];

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              sx={{ display: { sm: "none" } }}
              onClick={toggleDrawer(drawerOpen)}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                component="img"
                src="/tcmc_icon.png"
                alt="TCMC Logo"
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="h6">TCMC Portal</Typography>
            </Box>
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
            <Box></Box>
          ) : (
            // <Box>
            //   <IconButton onClick={handleMenu}>
            //     <Avatar src={user.picture} />
            //   </IconButton>
            //   <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
            //     <MenuItem
            //       onClick={() => {
            //         handleClose();
            //         logout();
            //       }}
            //     >
            //       Logout
            //     </MenuItem>
            //   </Menu>
            // </Box>

            <Box>
              <IconButton onClick={handleMenu}>
                <Avatar src={user.picture} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                  Profile
                </MenuItem>
                <MenuItem component={Link} to="/kids" onClick={handleClose}>
                  Kids
                </MenuItem>
                <MenuItem component={Link} to="/checkin" onClick={handleClose}>
                  CheckIn
                </MenuItem>
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
    </>
  );
};

export default Navbar;
