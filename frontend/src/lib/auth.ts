interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export function isAuthenticated(): string | false {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return false;
  }

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1])) as DecodedToken;
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      removeAuthToken();
      return false;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }

  return token;
}

export function setAuthToken(token: string): void {
  localStorage.setItem("jwtToken", token);
}

export function removeAuthToken(): void {
  localStorage.removeItem("jwtToken");
}
