exports.register = (req, res) => {
  const users = readUsers();
  const { name, email, mobile, password, role } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ name, email, mobile, password, role });
  writeUsers(users);
  res.status(201).json({ message: "Registered successfully" });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ message: "Login successful", user });
};

exports.getAllUsers = (req, res) => {
  res.json(readUsers());
};
