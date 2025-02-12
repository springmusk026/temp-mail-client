
const baseUrl = "https://stackblitz.com/api/";
const headers = {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.7",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Brave\";v=\"133\", \"Chromium\";v=\"133\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-csrf-token": "AOGPyltjMXD_11ZZTWH2SictQYM8J2wC44zGfzH0dO4oyg-Y_ybL8C30R7mZhMvppD5G-K5gA0QUfzKJfNIX6w",
    "x-newrelic-id": "VwcPUldXCRAFVFNSBQYBU10=",
    "cookie": "ahoy_visitor=2d9ca682-49d4-4ad9-b2bf-812fce096e00; ahoy_visit=d6d062b4-705c-4194-8b45-9453018a43da; guest_id=0S8sQO%2FOCLKJBYlUq4RYNDEexw2d6TM4FAS48kGDGlxkJKjWJFI%2BLVFXPOIVG8AG%2B0ODG64LIZjI7VRNTscgQtlcajcRrPyDXw5tHkxNHVMvX0I1n02Jf02BTHX3YqHjl%2FShH0nEODuFgHJUxFC2tw%3D%3D--mYuiJYuak0lEVHWO--6UwVltVrEFLVteYsyp16Wg%3D%3D; CSRF-TOKEN=AOGPyltjMXD_11ZZTWH2SictQYM8J2wC44zGfzH0dO4oyg-Y_ybL8C30R7mZhMvppD5G-K5gA0QUfzKJfNIX6w; _session_id=OUim3CIR3Fp12ijAxoPhxVsWUUFQCOMhPvBIMh4756IxuFm%2BLQj7zjYV1GNfcRkZG7WJDLWYs0fX0dbooAtmaAeSy9SCaSycbICtrRYUuf4hOelWvFHDHDO9mulfPaXzP0pf%2Fmtt56bycGZrRC62AdHtrxYqbts0CYlaPaJEw1LQX2otZ6LFFC7MqLx%2FofRQADU3EgM7MxGJ5VWR7WgMN0mSHrl1LnCQqwS0ePWi451iYGutNkdbLyBAqOsBwEW%2BAze5FDda7ynwU9uIdqOwqpVdZ3MTEGZ%2BeueZ7%2BzqgfCPItbUMeasZeMz5LfRGTfAsW8cAT%2BrK0vvPgFDqSW7cT3cw6wWOXnbMDb7FEjql3GO9h4kUS%2B5OkVC%2FNIP4MijPtaAcbH9BkYHKUoZyiFF48OgUU2DR%2BMOrwF6c%2BeVhoAUrThI30NrnG8KGMKaEGt9WOVZWchGc41iNBuQQq6xWzfSodTBBJEZHPQD0Vy3LPVS7sDt%2FiSVWabSBxq7TZI43ftk%2FjYgYcwbzuY03VhXhYkLk%2BfAH7E%2FOJGQyO8%2F5XmAXfTWxBe11WoJvFsdRvZ6Ov6oFmY3dpPK0PwpkyxTrF207Dv7OEcqxoScW26QUE4AB%2F6L8maDZ3agUszCrdR8aATImmEo4Peraj5nWxiX1nOhmhoy0K6lvxVTAOI96oi5p%2FqMpVIMR97uAHTaa%2FcTp5Gr52vI8f%2F8ZrlSHS9Ryv%2FlgPJfojEIGu%2BOVfmNCnGr7obeIg3LAmZsxxl7PIBGkAF4BltF0Z6FmdgcV87jX2Zp%2B8yw4XLkcLg%2FU%2FNmwO%2BWATeZJuAmZdl7Ju2llMSznuyHMYv75tXPXq0E4YbUbHv3cZ7A6dl1pPNOgKRp6R8TwXmEq1%2BQ1zEnv8VQIWyFVjRoWOpyDczndFzN7TWhEExsWTelOc%2Bb%2FrwP1y8bNir%2BpddL6KAsmUAI7hSi%2BkBt12ug%2FcEbUtciDqOtOlUYQtYJbJdS0k2XMEF3r2PyN7TzIkFTgtjsSjmdSN8W1RUuS%2FYG7f26Xgp%2FLH49%2Bkim--3E4JGiRdXk0RorNl--rmcT73%2B9Dfi%2B0vJvNKqc7Q%3D%3D",
    "Referer": "https://stackblitz.com/register?redirect_to=%2Foauth%2Fauthorize%3Fclient_id%3Dbolt%26response_type%3Dcode%26redirect_uri%3Dhttps%253A%252F%252Fbolt.new%252Foauth2%26code_challenge_method%3DS256%26code_challenge%3DyO5wm0dQURnlcdpif_5zf2UY770mpMFJ8mm6RxMgpN0%26state%3D5bc65d8d-30fa-4e9a-ac32-29887c1fb285%26scope%3Dpublic%26rid%3Drkremq",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}

const register = async (email) => {
    try {
        const payload = {
            user: {
                email: email,
                username: email,
                password: "Asdf@#1224",
                password_confirmation: "Asdf@#1224"
            }
        }
        const response = await fetch(`${baseUrl}/users/registrations`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

register("topovo5971@perceint.com").then(console.log)
module.exports = {
    register
}