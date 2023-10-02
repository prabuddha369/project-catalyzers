import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
const project = await fetch("http://localhost:3000/api/projects/");
const user = await fetch("http://localhost:3000/api/user/");
console.log(user);
const array = await project.json();
console.log(array);
const page = () => {
  return (
    <div style={{ overflow: "hidden", padding: "20px" }}>
      <Stack flexWrap="wrap" justifyContent="start" gap={5} direction="row">
        PROJECTS
        {array.map((item, index) => (
          <Box key={index}>
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
              <CardContent className="bg-[#0b1539] w-auto h-10 flex items-center justify-center transform transition duration-150 ease-in ">
                <Typography variant="h6" component="div" color="#ffffff">
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Stack>
    </div>
  );
};

export default page;
