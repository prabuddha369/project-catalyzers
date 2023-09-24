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
    <div style={{ overflow: "hidden", padding: "20px" }}>
      <Stack flexWrap="wrap" justifyContent="start" gap={5} direction="row">
        {projects.map((item, index) => (
          <Box key={index}>
            <Link href={user ? `/project/${item.projectID}` : "/signin"}>
              <Card className="h-auto transform transition duration-150 ease-in rounded-[1.5rem] hover:scale-105">
                <CardMedia
                  component="img"
                  alt={item.title}
                  src={item.thumbnailUrl}
                  sx={{
                    width: 250,
                    height: 112.5, // 16:9 aspect ratio (9 / 16 = 0.5625)
                  }}
                />
                <CardContent className="bg-[#0b1539] w-auto h-10 flex items-center justify-center transform transition duration-150 ease-in">
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
