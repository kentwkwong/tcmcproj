import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { calculateAge, formatDate } from "./Utility";
import { Kid } from "../types/Kid";
import StyledQRCode from "./StyledQRCode";

interface Props {
  kid: Kid;
  onEdit: (kid: Kid) => void;
  onDelete: (id?: string) => void;
}

const KidCard: React.FC<Props> = ({ kid, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {kid.name} ({kid.gender})
        </Typography>
        <Typography variant="body2">
          DOB: {formatDate(kid.dob)} (Age: {calculateAge(kid.dob)})
        </Typography>

        {kid._id && (
          <Box mt={2}>
            <StyledQRCode value={kid._id} />
          </Box>
        )}

        <Box mt={2} display="flex" gap={1}>
          <Button variant="outlined" size="small" onClick={() => onEdit(kid)}>
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onDelete(kid._id)}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KidCard;
