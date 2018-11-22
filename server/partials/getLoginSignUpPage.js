export default (url, errors = []) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <div id="app"></div>
    <form action="${url}" method="post" >
        <input type="text" name="nickname">
        <input type="password" name="password">
        <input type="submit">
    </form>
    <div class="errors">${errors}</div>
</body>
<script src="assets/js/bundle.js"></script>
</html>
`;
