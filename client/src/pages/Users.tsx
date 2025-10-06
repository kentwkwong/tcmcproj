import { useEffect, useState } from "react";
import {
  Typography,
  Checkbox,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import axios from "../api/axios";
import { User } from "../types/User";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users/getall"); // updated endpoint
      setUsers(res.data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      toast.error(err.response?.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "A" | "U") => {
    try {
      let res = await axios.put(`/users/role/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success(res.data.message);
    } catch (err: any) {
      console.error("Admin update failed:", err);
      toast.error(err.response?.data.error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Administration
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Admin Role</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.role === "A"}
                      onChange={(e) =>
                        handleRoleChange(
                          user._id!,
                          e.target.checked ? "A" : "U"
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Users;
