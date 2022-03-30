import { CardContent, Typography, Card } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React, { FC } from "react";
interface InfoCardProps {
  name: string;
  email: string;
  food: string;
  drinks: string;
  id: string;
  isOk: boolean;
}

const InfoCard: FC<InfoCardProps> = ({
  drinks,
  email,
  food,
  name,
  id,
  isOk,
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        {isOk && <div>✅👌</div>}

        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {id}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {email}
        </Typography>
        <Typography variant="body2">
          <li>Food :{food}</li>
          <li>Drinks:{drinks}</li>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
