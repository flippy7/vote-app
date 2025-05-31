poll = Poll.create!(title: "What is your favorite language?")
poll.votes.create!(option: "Ruby")
poll.votes.create!(option: "JavaScript")
poll.votes.create!(option: "Python")

poll2 = Poll.create!(title: "What is your favorite OS")
poll2.votes.create!(option: "Windows")
poll2.votes.create!(option: "Linux")
poll2.votes.create!(option: "Mac OS")