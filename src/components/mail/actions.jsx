const ceredonSubmit = () => {
  // usere.to="";
  usere.subject = "Project Broadcasted";
  usere.discdescription = "A new assignment";
  usere.description = "project uploaded by student do please check it";
  usere.titlemail = "Project Broadcasted";
  usere.mailLink = "";
  usere.descriptiontitlemail =
    " is broadcasted. Please check and apply if you are able to do it perfectly and in time.";
  // admins.map((admin) => (usere.to=admin.data().email, onSubmit()));
  let tooere = admins.map((admin) => admin.data().email);
  const chunkSize = 80;
  // const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
  const groups = tooere
    .map((e, i) => {
      return i % chunkSize === 0 ? tooere.slice(i, i + chunkSize) : null;
    })
    .filter((e) => {
      return e;
    });
  groups.map((checkmail) => ((usere.to = checkmail), onSubmit()));
  console.log(groups.map((checkmail) => checkmail));
  console.log(groups);

  // onSubmit();
};

// usere.maillink= assign_id;
const ceredOnAssignSubmit = () => {
  // usere.to="guptakunal738@gmail.com";
  usere.subject = "Project Assigned";
  usere.discdescription = "Project with ID ";
  usere.description = "project assign to teacher";
  usere.titlemail = " Project Assigned";
  usere.descriptiontitlemail =
    " has been assigned to you successfully. We hope for the best and in time submission.";
  onSubmit();
};

const ceredOnAcceptSubmit = () => {
  // usere.to="guptakunal738@gmail.com";
  usere.subject = "Project Accepted";
  usere.discdescription = "Project with ID ";
  usere.description = "project accepted";
  usere.titlemail = " Project Accepted";
  usere.descriptiontitlemail =
    " has been accepted. Thanks for you submission and Please do check more assignments";
  onSubmit();
};

const ceredOnRejectSubmit = () => {
  // usere.to="guptakunal738@gmail.com";
  usere.subject = "Project Rejected";
  usere.discdescription = "Project with ID ";
  usere.description = "project rejected";
  usere.titlemail = " Project Rejected";
  usere.descriptiontitlemail =
    " has been Rejected.There may be not up to the mark, irrelevant submission or exceeded time limit. Checkout more assignments. Better luck next time";
  onSubmit();
};
