import React from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Box,
} from "@mui/material";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";
const Projects = ({ projects }) => {
  const { user } = UserAuth();
  return (
    <div style={{ overflow: "hidden", padding: "10px" }}>
      <Stack flexWrap="wrap" justifyContent="center" gap={2} direction="row">
        {projects.map((item, index) => (
          <Box key={index}>
            <Link href={user ? `/project/${item.projectID}` : "/signin"}>
              <Card className="h-auto transform transition duration-150 ease-in md:hover:scale-105">
                <CardMedia
                  component="img"
                  alt={item.title}
                  src={item.thumbnailUrl}
                  sx={{
                    width: {
                      xs: "300px",
                      sm: "358px",
                      md: "320px",
                      lg: "138px",
                    },
                    height: {
                      xs: "140px",
                      sm: "201px",
                      md: "150px",
                      lg: "134px",
                    },
                  }}
                />
                <CardContent className="bg-[#0b1539] w-auto h-10 flex items-center justify-center transform transition duration-150 ease-in ">
                  <Typography variant="h6" component="div" color="#ffffff">
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Box>
        ))}
      </Stack>
    </div>
  );
};

export default Projects;
