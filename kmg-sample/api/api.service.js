const Sequelize = require('sequelize');
const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

sequelize = new Sequelize('', '', '', {
    host: '',
    dialect: '',
    operatorsAliases: false,
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Table1 = sequelize.define('Table1', {
    EmployeeID: {
        type: Sequelize.STRING(255),
        primaryKey: 'true'
    },
    PhoneNumber: {
        type: Sequelize.STRING(255)
    },
    Password: {
        type: Sequelize.STRING(255)
    },
    SOS: {
        type: Sequelize.STRING(255)
    },
    Count: {
        type: Sequelize.STRING(255)
    },
    OTP: {
        type: Sequelize.STRING(255)
    }
});

const Table2 = sequelize.define('Table2', {
    EmployeeID: {
        type: Sequelize.STRING(255)
    },
    SurveyID: {
        type: Sequelize.INTEGER,
        primaryKey: 'true',
        autoIncrement: true
    },
    SurveyName: {
        type: Sequelize.STRING(255)
    },
    SurveyType: {
        type: Sequelize.STRING(255)
    }
});

const Table3 = sequelize.define('Table3', {
    SurveyID: {
        type: Sequelize.STRING(255)
    },
    GroupID: {
        type: Sequelize.INTEGER,
        primaryKey: 'true',
        autoIncrement: true
    },
    GroupName: {
        type: Sequelize.STRING(255)
    }
});

const Table4 = sequelize.define('Table4', {
    GroupID: {
        type: Sequelize.STRING(255)
    },
    QuesID: {
        type: Sequelize.INTEGER,
        primaryKey: 'true',
        autoIncrement: true
    },
    Question: {
        type: Sequelize.STRING(255)
    },
    QuestionType: {
        type: Sequelize.STRING(255)
    },
    Weightage: {
        type: Sequelize.STRING(255)
    },
    Mandatory: {
        type: Sequelize.STRING(255)
    }
});

const Table5 = sequelize.define('Table5', {
    QuesID: {
        type: Sequelize.STRING(255)
    },
    EmployeeID: {
        type: Sequelize.STRING(255)
    },
    Answer: {
        type: Sequelize.STRING(255)
    },
    AnswerID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: 'true'
    }
});

sequelize.sync();

module.exports = {
    signup,
    login,
    verifyOTP,
    getOTP,
    update,
    update2,
    getSurvey,
    setData,
    getGroup,
    getQuestion,
    logout,
    getProfileData,
    changeNumber,
    changeSOS
};

function logout(req, res) {
    var userParam = req.body;
    userParam.Username = userParam.username;
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: "Username Name Not Registered."
            });
        } else {
            res.status(200).json({
                message: "User Logged Out Successfully."
            });
}})}

function login(req, res) {
    var userParam = req.body;
    userParam.Username = userParam.username;
    userParam.Password = userParam.password;
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: "Username Name Not Registered."
            });
        } else {
            if (user[0].dataValues.Password != userParam.Password) {
                res.status(200).json({
                    message: "Please Enter Correct Password."
                });
            } else {
                var otp = Math.floor(1000 + Math.random() * 9000);
                user.otp = otp;
                Table1.update(
                    { OTP: otp.toString() },
                    {
                        where: {
                            EmployeeID: userParam.Username
                        }
                    }
                ).then(result =>
                    console.log(result)
                )
                    .catch(err =>
                        console.log(err)
                    )

                client.messages.create({
                    to: '',
                    from: '',
                    body: otp.toString()
                }).then((message) => console.log(message.sid))
                    .then(
                        res.status(200).json({
                            message: "OTP Has Been Sent To Your Registered Mobile Number."
                        }));
            }
        }
    });
}

function signup(req, res) {
    var userParam = req.body;
    userParam.Username = userParam.username;
    userParam.Password = userParam.password;
    userParam.PhoneNumber = userParam.phoneNumber;
    userParam.SOS = userParam.sos;
    userParam.OTP = userParam.otp;
    var user = [];
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            Table1.create({
                EmployeeID: userParam.Username,
                PhoneNumber: userParam.PhoneNumber,
                Password: userParam.Password,
                SOS: userParam.SOS,
                Count: userParam.Count,
                OTP: userParam.OTP
            }).catch(function (err) {
                console.log(err);
            });
            res.status(200).json({
                message: "Saved.",
                user: {
                    EmployeeID: userParam.Username,
                    PhoneNumber: userParam.PhoneNumber,
                    Password: userParam.Password,
                    SOS: userParam.SOS,
                    OTP: userParam.OTP
                }
            });
        } else {
            res.status(200).json({
                message: "User Already Exists."
            });
        }
    });
}

function verifyOTP(req, res) {
    var userParam = req.body;
    userParam.OTP = userParam.otp;
    userParam.Username = userParam.username;
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: "Please Enter Valid OTP."
            });
        } else {
            if (user[0].dataValues.OTP != userParam.OTP) {
                res.status(200).json({
                    message: "Please Enter Valid OTP."
                });
            } else {
                res.status(200).json({
                    message: "Verified."
                });
            }
        }
    });
}

function getOTP(req, res) {
    var userParam = req.body;
    userParam.Username = userParam.username;
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: "Username Name Not Registered."
            });
        } else {
            var otp = Math.floor(1000 + Math.random() * 9000);
            user.otp = otp;
            Table1.update(
                { OTP: otp.toString() },
                {
                    where: {
                        EmployeeID: userParam.Username
                    }
                }
            ).then(result =>
                console.log(result)
            )
                .catch(err =>
                    console.log(err)
                )

            client.messages.create({
                to: '',
                from: '',
                body: otp.toString()
            }).then((message) => console.log(message.sid))
                .then(
                    res.status(200).json({
                        message: "OTP Has Been Sent To Your Registered Mobile Number."
                    }))
        }
    })
}

function update(req, res) {
    var userParam = req.body;
    userParam.Username = userParam.username;
    userParam.Password = userParam.newpassword;
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: 'Username Name Not Registered.'
            });
        } else {
            Table1.update(
                { Password: userParam.Password },
                {
                    where: {
                        EmployeeID: userParam.Username
                    }
                }
            ).then(function (result) {
                console.log(result);
                res.status(200).json({
                    message: 'Password  Successfully Changed.'
                });
            })
                .catch(err =>
                    console.log(err)
                )
        }

    })
}

function update2(req, res) {
    var userParam = req.body;
    userParam.Username = userParam.username;
    userParam.OldPassword = userParam.oldPassword;
    userParam.NewPassword = userParam.newpassword;

    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: 'Username Name Not Registered.'
            });
        } else {
            if (user[0].dataValues.Password == userParam.OldPassword) {
                Table1.update(
                    { Password: userParam.NewPassword },
                    {
                        where: {
                            EmployeeID: userParam.Username
                        }
                    }
                ).then(function (result) {
                    console.log(result);
                    res.status(200).json({
                        message: "Password  Successfully Changed."
                    });
                })
                    .catch(err =>
                        console.log(err)
                    )
            } else {
                res.status(200).json({
                    message: "Please Enter Your Registered Password."
                });
            }
        }
    });
}

function getSurvey(req, res) {
    var userParam = req.body;
    userParam.Username = userParam.username;
    Table2.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (survey) {
        if (survey.length == 0) {
            res.status(200).json({
                message: "No survey with corresponding UserID" + userParam.Username
            });
        } else {
            var obj = [];
            survey.forEach(element => {
                obj.push(element.dataValues);
            })
            console.log(obj);
            res.status(200).json({
                message: "Data Sent",
                surveyResults:obj
            });
        }
    })
}
function getGroup(req, res) {
    var userParam = req.body;
    Table3.findAll({
        where: {
            SurveyID: userParam.SurveyID
        }
    }).then(function (group) {
        if (group.length == 0) {
            res.status(200).json({
                message: "No group with corresponding SurveyID" + userParam.SurveyID
            });
        } else {
            var obj = [];
            group.forEach(element => {
                obj.push(element.dataValues);
            })
            res.status(200).json({
                message: "Data Sent",
                groupResults: obj
            });
        }
    })
}

function getQuestion(req, res) {
    var userParam = req.body;
    Table4.findAll({
        where: {
            GroupID: userParam.GroupID
        }
    }).then(function (question) {
        if (question.length == 0) {
            res.status(200).json({
                message: "No question with corresponding GroupID" + userParam.GroupID
            });
        } else {
            var obj = [];
            question.forEach(element => {
                obj.push(element.dataValues);
            })
            res.status(200).json({
                message: "Data Sent",
                questionResults: obj
            });
        }
    })
}

function setData(req, res) {
    var userParam = req.body;
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: "No user with userID" + userParam.Username
            });
        } else {

            Table2.create({
                EmployeeID: userParam.Username,
                SurveyName: userParam.SurveyName,
                SurveyType: userParam.SurveyType
            }).catch(function (err) {
                console.log(err);
            }).then(function () {
                Table2.findAll({
                    where: {
                        EmployeeID: userParam.Username,
                        SurveyName: userParam.SurveyName,
                        SurveyType: userParam.SurveyType
                    }
                }).then(function (table2Content) {
                    Table3.create({
                        SurveyID: table2Content[0].dataValues.SurveyID,
                        GroupName: userParam.GroupName
                    }).catch(function (err) {
                        console.log(err);
                    }).then(function () {
                        Table3.findAll({
                            where: {
                                SurveyID: table2Content[0].dataValues.SurveyID,
                                GroupName: userParam.GroupName
                            }
                        }).then(function (table3Content) {
                            for(var q=0;q<parseInt(userParam.Number);q++) {
                                Table4.create({
                                    GroupID: table3Content[0].dataValues.GroupID,
                                    Question: userParam.Question[q].Question,
                                    QuestionType: userParam.Question[q].QuestionType,
                                    Weightage: userParam.Question[q].Weightage,
                                    Mandatory:userParam.Question[q].Mandatory
                                }).catch(function (err) {
                                    console.log(err);
                                });
                            }
                            
                            res.status(200).json({
                                message: "Data Saved"
                            });
                        })
                    })

                })
            })
        }
    })
}
function getProfileData(req, res) {
    var userParam = req.body;
    userParam.Username = userParam.username; 
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: "No user with userID" + userParam.userID
            });
        } else {

            res.status(200).json({
                message: "Data Sent",
                user: user[0].dataValues
            });
        }
    })
}
function changeSOS(req, res) {
    var userParam = req.body;
    userParam.SOS = userParam.sos;
    userParam.Username= userParam.username;
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: "No user with userID" + userParam.userID
            });
        } else {
            Table1.update(
                { SOS: userParam.SOS },
                {
                    where: {
                        EmployeeID: userParam.Username
                    }
                }
            ).then(result =>
                console.log(result)
            )
                .catch(err =>
                    console.log(err)
                )
            res.status(200).json({
                message: "SOS updated"
            });
        }
    })
}
function changeNumber(req, res) {
    var userParam = req.body;
    userParam.PhoneNumber = userParam.phoneNumber;
    userParam.Username= userParam.username;
    Table1.findAll({
        where: {
            EmployeeID: userParam.Username
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.status(200).json({
                message: "No user with userID" + userParam.userID
            });
        } else {
            Table1.update(
                { PhoneNumber: userParam.PhoneNumber },
                {
                    where: {
                        EmployeeID: userParam.Username
                    }
                }
            ).then(result =>
                console.log(result)
            )
                .catch(err =>
                    console.log(err)
                )
            res.status(200).json({
                message: "phone updated"
            });
        }
    })
}