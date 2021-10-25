* React frontend (typescript of course because normal javascirpt sucks!, tailwind)
    * Dynamic routes (for each user on a chat)
        * Each user gets a separate id
        * User will entere in a name when they load the website
            * There can't be a duplicate name
            * So you can message a separately
* Go backend (websockets)
    * Keep each users name in a array
        * If the name is entered in a go say no
            * use that name to send messages to them
