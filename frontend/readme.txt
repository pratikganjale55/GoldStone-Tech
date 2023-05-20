

     
Frontend : 
        Landing page : here user can see all users details in table format and download CSV button also 
        Edit action : once click on edit button popup comes, using this user cant edit informations 
        Download CSV file : click on download master csv button user can download csv file as per data 
Backend : 
        GET : fetch data using url and save in database and also implement cache 
        PUT : update current user information and update database 
        GET : download CSV file as per information present in database
Database : 
        Store information 
        Model const detailsSchema = new mongoose.Schema({
                                id :Number ,
                                name: String,
                                email: String,
                                gender: String,
                                status: String,
                                created_at: Date,
                                updated_at: Date
                            })    

Github Repo :  https://github.com/pratikganjale55/GoldStone-Tech
Live Demo(2 Min) : https://drive.google.com/file/d/1QyBgyr9gt0i7lNuagOhqg41PSMm1JPXx/view