export default (user) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <div id="app"></div>
    <div>${user.isGuest()}</div>
</body>
<script src="assets/js/bundle.js"></script>
</html>
`;
