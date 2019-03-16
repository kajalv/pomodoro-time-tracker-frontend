# Front End Tests

## Steps To Run

In the current directory `test`:

    python3 -m virtualenv venv
    source venv/bin/activate
    pip3 install selenium
    pip3 install chromedriver
    pip3 install webdriver-manager

Then, the `https://chromedriver.storage.googleapis.com/72.0.3626.69/chromedriver_mac64.zip` was copied here and unzipped.  
**This file needs to be replaced according to the system and version.**  
**TODO:** Figure out how to remove this dependency on the type of system.

    chmod +x chromedriver

Run the tests with:

    python3 runner.py

## References

[Selenium Page Objects](https://selenium-python.readthedocs.io/page-objects.html)
