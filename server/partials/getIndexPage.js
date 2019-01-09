export default (user) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link href="/assets/main.css" rel="stylesheet" type="text/css">
</head>
<body>
    <div id="app"></div>
    <div>${user.isGuest()}</div>
</body>
<script src="/assets/bundle.js"></script>
</html>
`;
