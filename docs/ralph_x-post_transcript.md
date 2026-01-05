Here's a full transcription of the 16-minute video in Matt Pocock's X post. I've cleaned it up for readability while staying faithful to what was spoken (including minor stutters and informal phrasing where relevant):

"I'm going to do something that I don't usually do for these videos and give it a pretty hypey intro. One of the dreams with coding agents is that you can wake up in the morning to working code that your coding agent has worked through your backlog overnight, and it's just spit out a whole bunch of code for you to review. It works.

Now, people have been trying to make this work for a while with agent swarms, mesh orchestrators. But what if I told you that the way to get this to work is with a for loop?

I'm going to show you a technique for running coding agents that makes it devilishly simple, that is a vast improvement over any other AI coding orchestration setup I've ever tried, and allows you to actually ship working stuff with long-running coding agents. And everyone's calling it the Ralph Wiggum method.

This is credited to Jeffrey Huntley, and even though this came out on the 14th of July [2025], Ralph is kind of having a moment right now. That's because this article advocates an extremely simple approach to agent orchestration, and it requires the underlying coding model to be really good. And with Opus 4.5 and GPT-5.2 that have come out, they are very, very good. It means that simpler approaches like this are now really viable. I think they should be recommended.

So let's get started and understand why Ralph is so good.

Before we get stuck into the code, I want to talk about what software engineers actually do. I'm going to use some terms from Agile, not because I really care about Agile, but most software developers out there will be working in some form of Agile terminology.

You usually have, as a software engineer, a sprint—or things that you need to get done. Each of these are little tasks that need to be grabbed by the engineers and done before the end of the sprint. A sprint is usually time-boxed, right? So you start it on some date and end it, let's say one-week sprints, two-week sprints, whatever.

But in the AI coding world, you don't need to worry about time-boxing these sprints because the AI has infinite amounts of endurance and can work forever in theory. So when I code, this is really just a list of tasks that needs to be done in some order or another.

How would you get an AI to work through this entire backlog? Well, what you could do is get 16 AI agents to individually work on each task, but that would be absolutely hellish because you'd end up with a ton of merge conflicts, and tasks might have little dependencies between each one that are quite hard to spot by just looking at it. One thing obviously couldn't break, and you'd end up with crappy code. (I've got a video on context windows if you want to understand more about what I mean by context rot.)

So most smart AI coders are doing now is they would split this into a multi-phase plan, and the LLM would then be able to work through each one of these, clearing its context as it went. You can imagine the multi-phase plan was actually a Markdown, and you would create this big plan that the LLM would then, in multiple context windows, go and progress through.

This is previously, before I discovered Ralph, how I've been doing my AI coding. I make these big plans and then say, 'Okay, do phase one,' then 'Do phase two,' then 'Do phase three.' But one thing I've noticed here is it's really hard to add stuff to the plan when you need to—like, the human orchestrator, you need to work out where it fits in the exact place of the multi-phase plan. And of course, you need to figure out all these arrows here; you need to figure out the right path to go through. And of course the LLM can help you, but there's still a lot of work that you do up front.

And the thing that always bothered me is that this doesn't really reflect how engineers actually work. Real engineers will take a look at the Kanban board and they'll go, 'Okay, I need to work on this task next,' then they'll take that task and complete it, go back to the board and notice, 'Okay, that task is missing—let me find the next highest-priority task,' then they'll complete that, and the cycle continues until the sprint is complete.

This means that when you design in the sprints, all you're doing is designing how it should look at the very end. And so if you need to add a task into this loop, all you do is just add a new thing there—you add an extra specification for what the feature should look like at the end.

Now, if we look closer here, we've got ourselves a loop where you specify some list of tasks to complete, the LLM goes and completes that task, then when all of the tasks have disappeared—there's nothing left for it—it then completes the loop and is done.

So going back to Geoffrey Huntley's article, this is what Ralph is. Ralph is a bash loop. You give the LLM some task to complete—or list of tasks—and run it again and again until it's complete.

Now at this point, you probably have a bunch of questions about the approach, so let's dive into the code to answer them.

We are inside an important repo, which is my course video manager. This is an app that I built to edit videos, to manage courses, to use AI to help me write articles. It is a complex piece of code. And inside the plans directory here, I have a ralph.sh file.

Let's explain this line by line.

First of all, we set the error mode to make sure that any errors in here are thrown.

The way you run this loop is you run it with ./ralph.sh and pass in the maximum number of iterations. For instance, if I open up a terminal here and I just run plans/ralph.sh, then it's going to yell at me for not passing in the max number of iterations.

We then run a for loop where we stop the for loop if we pass the max number of iterations. In other words, yeah, we're running this for loop, but we do want a stop condition in case the LLM decides never to complete.

We then do a bit of logging—we log out a line—and then run Claude code. It doesn't really matter which one you run here, whether you're running Claude with the CLI or running OpenAI code, whether you're running Codex—as long as it's some kind of LLM that you can call a coding agent that you can invoke by the CLI.

We then pass two really important local files on the file system. First of all, we pass it a plans/prd.json. Let's open that up to see what that looks like.

Here, this is a JSON file with a bunch of different user stories in it. For instance, I've been working on featuring my video editor called Beats, where I can just specify a clip to add a slight bit of gap at the end of it. In the UI, beats should display as three orange ellipses (dots) below the clip. So you add a beat to a clip—verify that three orange dots appear below the clip, verify that they're orange-colored, verify that they form an ellipse pattern.

As you can probably tell, I've been iterating on this file with the LLM to help me. Each one of these items in this PRD (product requirements document) represents a to-do list. We can see that the pre-recording checklist or—let's go to the one above—'Delete video shows confirmation dialog before deleting.' We can see that is passing in the UI right now. In other words, this work is complete and we don't need to do it anymore.

So as you can tell, this PRD represents this list of tasks here. Each one of these tasks represents a free-text log that the LLM can append to with its learnings as it went through. We think of this as one of the things it learned on this sprint—again, implementing a bunch of PRD items here. And so this represents the LLM's memory for these sprints. When I get to the end of the sprint, I would usually just delete it, but this as well as the PRD represents the work that was done.

What it usually does at this point is just mark the right PRD items as 'passed: true' and then append to the progress.txt file. Append is really important—if you tell it to update, it will usually just update the entire file, whereas append means it usually goes and sticks some stuff at the end. I've just got some loose advice here saying, 'Use this to leave a note for the next person working in your codebase.'

I then say, 'Make a git commit of that feature.' So it commits the PRD, commits the progress.txt file, and then it commits all the work that is done. So each time we're going through a loop here, we're getting a git commit. This is really, really useful because it means that the LLM can query the git history as well as see the progress.txt to see what's been done previously and get context for what it needs to do now.

Finally, we say, 'Only work on a single feature.' The reason we say this—and the reason we do this whole PRD dance at all—is the whole thing which is that LLMs get really stupid as you add more tokens to the context window, and you produce crappier code as a result.

This also means we need to be careful about sizing the tasks too. If we have one enormous task here and then a bunch of smaller tasks, then when the LLM gets to this one, it's just going to be swallowed up. So when we design the PRD, we've got to make sure that all of the tasks are nice and small.

To make things really as easy as possible for the LLM—and to be honest, this is just good practice anyway. If you design massive features that take huge amounts of time in your sprints, you're not gonna have a fun time, whether it's an AI or a human.

Now, finally getting to the end of the prompt, we say, 'If, while implementing the feature, you notice that the PRD is complete, output "PRD complete" here.' All of this we have saved in a variable here that we then echo out to the terminal and check to see if it contains 'PRD complete' here. And if it does, then exit out of the loop early.

I've also set up—there's a nice little CLI here. This is our description of the set of tasks that need to be done. You have a progress.txt file that you then append to, and then you run this thing in a loop with a backstop to make it stop running infinitely.

However, how do you know that it's going to produce working code, right? How do you prevent it from just running endlessly and spitting out bad stuff?

Well, to make Ralph really work, you really need feedback loops. This is, of course, where TypeScript comes to the fore—right? Check that type checks via pnpm type-check, and that the unit tests pass via pnpm test. Whenever your Ralph loop commits, CI has to stay green.

One easy way that Ralph can fail is if it commits some bad code, then it doesn't know where the bad code came from because it lost all of its memory. This is another reason why small tasks are good—the LLM is usually really focused on that small task, able to write tests that just cover that user story, and keeping it focused on a small change usually means it produces better outputs and is able to see the feedback loop for that feature.

By the way, another article you should definitely use is a recommendation from Anthropic. Another thing they recommended is absolutely robust feedback loops. In the article, they noticed Claude's tendency to mark features complete without proper testing, but it did much better at verifying features end-to-end once explicitly prompted to use browser automation tools and do all tests as a human user would.

So these feedback loops are essential for the LLM knowing that the code works. And again, this is another reason to keep these changes really small so you still have context window left for the LLM actually checking it works. Doing things like hooking it up to a Playwright MCP server is good but quite expensive, so make sure tasks are small so you have the budget to poke around and view images.

Now, we've talked about Ralph as an asynchronous coding agent that can run overnight—a kind of AFK (away from keyboard) Ralph. But the modification we can make to this is just stick a human in the loop here. This is something I've been experimenting with for difficult-to-implement features—features where I want to do a lot of steering of the LLM. And it's also a great way to learn Ralph's capabilities and understand what it's doing.

For this setup, I have a ralph-once.sh file inside my repo that I pretty often use. It has pretty much exactly the same prompt as the normal Ralph, except it just runs in an interactive terminal instead.

So let's actually do something which you've been waiting for, which is: let's see it in action.

I'm gonna run plans/ralph-once.sh, and it's gone for 21, 23, 27—so it's only going to do 'Beats display as three orange ellipses dots below clip.' And there's some nice reasoning that without the visual display working, the other beat UI items can't be verified. Then it gives itself a little plan here and is gonna start the implementation.

Okay, we can see it's created the BeatIndicator component, added the tests here—that all looks good. So they both passed, does a bit more verification, and then it marks the PRD as passed: true.

Once that was done, I went down and edited the progress.txt file just here and even added a little note to itself saying, 'Okay, next you might want to think about this PRD item or maybe the beat playback item' or anything. It commits and diffs and does all of its good stuff.

And just so I can prove to you it worked, we can right-click one of these items here and press 'Add beat,' and we get this little three orange dots, which looks great.

See, I'm pretty happy with this. It's actually editing the video recording software while editing a video on recording—anyway, crazy.

So Ralph is usable and easy to use, even when I'm in this human-in-the-loop version. I still feel like I'm more productive than if I were to create a multi-phase plan or something. This concept of a loop where you just take stuff off the board, take it off the board, and keep working—it just feels so familiar. The multi-phase plans that I was doing before just felt really onerous to put together.

Instead of this kind of really anal-retentive planner here, Ralph puts you in the seat of the requirements gatherer, kind of product designer, where instead of focusing on how it's going to be done, you just focus on what it needs to do and how it should behave once it's complete. You go through, read the code, test everything works, then change the PRD if you need to.

More in my feedback loops with Ralph: you want more tests, higher-quality tests, non-flaky tests, an MCP server that can explore your application, and most of all, types—absolutely the strongest types you can get.

If you dug this stuff, then head to aihero.dev. I've been thinking about AI and talking about it up here. My latest course on the AI SDK allows you to learn how to master AI in TypeScript, and it's currently skinned in v5, but v6 came out recently, so I'm doing a free update for everyone who bought the v5 crash course.

But overall, thank you so much for watching. This was a really fun one to record because I just love this new style of coding. It just feels so much more intuitive than the stuff we were doing even three months ago.

And a final word too: if you're worried about getting left behind with this stuff, it all feels too hypey—just remember that the dev branch is always wackier than the main branch. We're experimenting with stuff here. Some of it works and some of it doesn't work. But in a couple years' time, we will coalesce around some kind of shared understanding of how to use these tools effectively, and that will still be just as prized two years from now as it is now.

So with that, thanks for watching. I will see you very soon on the fundamentals of development, which are basically trying to translate people's weird dreams into code in a language that computers understand. That's not going anywhere."