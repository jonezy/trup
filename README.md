# Toronto Transit Route Updater

Built this so that I could have local copies of all ttc stops with there
longitude and latitude.  I intend on using this to implement gelocation
in findtt.com

# Instructions

Issuing the folllowing command:

    trup run
    
will download ttc route stops (in a custom format below) to ./out/all.json

    {
    "routes": [
      {
        "title": "8-Broadview",
        "tag": "8",
        "stops": [
          {
            "lon": "-79.35861",
            "title": "Broadview Station",
            "stopId": "14638",
            "tag": "14160",
            "lat": "43.6766899"
          }
        ]
       }
      ]
    }
