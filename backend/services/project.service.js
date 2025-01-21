import mongoose from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("User is required");
  }

  const project = await projectModel.create({
    name,
    users: [userId],
  });
  return project;
};

export const getAllProjectByUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const projects = await projectModel.find({ users: userId });
  return projects;
};

export const addUsersToProject = async ({ users, projectId, userId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }
  if (!users) {
    throw new Error("Users are required");
  }
  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId(s) in users array");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }
  const project = await projectModel.findOne({
    id: projectId,
    users: userId,
  });

  if (!project) {
    throw new Error(
      "User does not have permission to add users to this project"
    );
  }

  const updatedProject = await projectModel.findByIdAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: {
          $each: users,
        },
      },
    },
    {
      new: true,
    }
  );
  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("ProjectId is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }
  const project = await projectModel
    .findOne({
      _id: projectId,
    })
    .populate("users");
  return project;
};
