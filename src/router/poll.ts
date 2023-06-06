import { Router } from "express";
import { wrap } from "./wrap";
import Poll from "../db/schema/Poll";
import { compareSync, hashSync } from "bcrypt";
import mongoose from "mongoose";

const router = Router();

router.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://obho-poll.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

router.get(
  "/:pollId",
  wrap(async (req, res) => {
    const { pollId } = req.params;

    if (!mongoose.isValidObjectId(pollId)) {
      throw new Error(`400 ${pollId} is not valid poll id.`);
    }

    const poll = await Poll.findById(pollId).orFail(new Error("404 Poll not found."));

    res.json({ poll });
  })
);

router.post(
  "/vote/:pollId",
  wrap(async (req, res) => {
    const { pollId } = req.params;
    const { option, ip } = req.body;

    if (!mongoose.isValidObjectId(pollId)) {
      throw new Error(`400 ${pollId} is not valid poll id.`);
    }

    const poll = await Poll.findById(pollId).orFail(new Error("404 Poll not found."));

    if (poll.options.length < Number(option)) {
      throw new Error(`400 The poll has only ${poll.options.length} options.`);
    } else if (!poll.open) {
      throw new Error("405 The poll is closed.");
    } else if (poll.voters.includes(ip)) {
      throw new Error("423 You already voted.");
    }

    poll.votes.push(Number(option));
    poll.voters.push(ip);
    await poll.save();

    res.sendStatus(200);
  })
);

router.post(
  "/create",
  wrap(async (req, res) => {
    const { name, description, options, password } = req.body;
    const pollId = (
      await Poll.create({
        name,
        options,
        description,
        password: hashSync(password, 10)
      })
    )._id;

    res.json({ pollId });
  })
);

router.get(
  "/close/:pollId/:password",
  wrap(async (req, res) => {
    const { pollId, password } = req.params;

    if (!mongoose.isValidObjectId(pollId)) {
      throw new Error(`400 ${pollId} is not valid poll id.`);
    }

    const poll = await Poll.findById(pollId).orFail(new Error("404 Poll not found."));

    if (!compareSync(password, poll.password)) {
      throw new Error("401 Incorrect password.");
    }

    poll.open = false;
    await poll.save();

    res.sendStatus(200);
  })
);

router.delete(
  "/:pollId/:password",
  wrap(async (req, res) => {
    const { pollId, password } = req.params;

    if (!mongoose.isValidObjectId(pollId)) {
      throw new Error(`400 ${pollId} is not valid poll id.`);
    }

    const poll = await Poll.findById(pollId).orFail(new Error("404 Poll not found."));

    if (!compareSync(password, poll.password)) {
      throw new Error("401 Incorrect password.");
    }

    await Poll.findByIdAndDelete(pollId);

    res.sendStatus(200);
  })
);

export default router;
