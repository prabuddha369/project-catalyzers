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

const Projects = ({ projects }) => {
  console.log(projects);
  return (
    <Stack flexWrap="wrap" justifyContent="start" gap={2} direction="row">
      {projects.map((item, index) => (
        <Box key={index}>
          <Link href={`/project/${item.projectID}`}>
            <Card className="hover:scale-105 h-auto transform transition duration-150 ease-in rounded-3xl">
              <CardMedia
                component="img"
                height="100"
                alt={item.title}
                src={item.thumbnailUrl}
                sx={{
                  width: { xs: "100%", sm: "358px", md: "320px" },
                  height: 180,
                }}
              />
              <CardContent className="bg-black/70 transform transition duration-150 ease-in ">
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="#ffffff"
                >
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

export default Projects;
