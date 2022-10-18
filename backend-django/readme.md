Employee Tracking CRUD APP

A DRF app with features of Simple CRUD operation and Authentications Using ModelViewSet and DRF Token.


Employee Actions:
    
    Create Tasks
    View Tasks (List And Details)
    Update Tasks (Put and Patch)
    Delete Tasks
    Update status of Assigned Tasks

Manager Actions: (Note : Manager can only perform actions of his Department)

    Create Tasks
    Assigned Tasks To Employees
    View Tasks (Note : Manager can only view task of his Department )
    Update Tasks (Put and Patch)
    Delete Tasks
    Update status of Assigned Tasks

Notifications
    
    An Email notification sent to Employee and his Deparment Manager
    When Task Assigned
    When Task Marked as Completed
    When Task Reopened

Admin Actions:
    
    Add Department
    Add role (Employee Desgination)
    Assigned Role
    Assigned Department
     

Developer Actions: 

    Upload csv task data using command line 
    command : python manage.py laod_task_data /path/to/file.csv


Authentication:
    
    All feature of Authentication all available by using 3r party pakage
    dj-auth-rest
    JWT
    