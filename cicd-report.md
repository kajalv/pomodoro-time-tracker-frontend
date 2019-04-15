# cicd-report

### Modules

- **BuildAndDeployBeta**: Build and deploy our frontend program to a beta test server. We have to manually trigger this task.
- **TestBeta**: Run frontend test on the frontend deployed at beta test server. This task will be triggered when BuildAndDeployBeta succeeded. 
- **BuildAndDeployProd**: Build and deploy our frontend program to production server. This task should be triggered when TestBeta task succeeded; however, due to some TestBeta issues, we currently set it to be triggered whenever TestBeta finished.

### Status

- **BuildAndDeployBeta**: This task works correctly.
- **TestBeta**: Currently the frontend test might not always succeed due to some `selenium-side-runner` issues. Hence, this task might succeed or fail unpredictably. Build #15 is one such build that passes all tests.
- **BuildAndDeployProd**: This task works correctly.
