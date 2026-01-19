<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('css/Authentication/Login.css') }}">
    <title>Login</title>
</head>
<body>
    <div class="container">
        <div class="login-container">
            <h1>facebook</h1>
            <div class="login-form">
                <h3>Log in to Facebook</h3>
                <form action="">
                    <div class="login-field">
                        <input type="text" placeholder="Email address or phone number">
                        <span></span>
                    </div>
                    <div class="login-field">
                        <input type="text" placeholder="Password">
                        <span></span>
                    </div>
                    <!-- <div class="login-field">
                        <select>
                            <option value="" disabled selected>Select Role</option>
                            <option value="customer">Customer</option>
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                        </select>
                        <span></span>
                    </div> -->
                    <div class="login-field">
                        <input type="submit" value="Log in">
                    </div>
                </form>
                <div class="link">
                    <a href="">Forgot account?</a>
                    <a href="">Sign up for ClearStock </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>