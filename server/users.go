package main;

import (
	"net/http"
	"encoding/json"
	"strings"
	"math/rand"
)

type UserResponse struct {
	ID uint
	Name string
	Email string
	City string
	Image string
	Interests string
	Reviews []ReviewResponse
	Rating_Average float64
	Profession string
	Company string
	Bio string
	State string
	Verified string
	NewFriends int
}

type TargetResponse struct {
	User UserResponse
	IsFriend bool
}

func handleUsers(w http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodGet {
		getNearbyUsers(w, req);
	}
}

func (u User) getUser() UserResponse {
	return UserResponse{ u.ID, u.Name, u.Email, u.getCity(), u.getUserImage(), strings.Join(u.getInterests(), "-"), u.getReviews(), u.getAverageRating(), u.Profession, u.Company, u.Bio, u.State, u.Verified, u.NewFriends}
}

func getNearbyUsers(w http.ResponseWriter, req *http.Request ) {
	var UserResponses []UserResponse;
	var cityId Cities;
	var users []User;
	var u User;
	city := req.Header.Get("City");
	email := req.Header.Get("Email");
	db.Where(&User{Email: email}).First(&u);
	if (len(city) > 0 && email == u.Email) {
		db.Where(&Cities{City_Name : city}).First(&cityId);
		db.Where(&User{CitiesID: cityId.ID}).Find(&users);
		users = u.sortUsers(u.filterSaves(u.filterFriends(u.filterRejects(users))));
		for _, v := range users {
			res := v.getUser();
			UserResponses = append(UserResponses, res);
		}
		r, _ := json.Marshal(UserResponses);
		w.Write(r);
	} else {
		badRequest(w, "bad get request", http.StatusBadRequest);
	}
}

func handleTarget(w http.ResponseWriter, req *http.Request) {
	var u User;
	var t User;
	if req.Method == http.MethodGet {
		targetEmail := req.Header.Get("Target");
		userEmail := req.Header.Get("User");
		db.Where(&User{Email: userEmail}).First(&u);
		db.Where(&User{Email: targetEmail}).First(&t);
		if u.Email == userEmail && t.Email == targetEmail {
			var ur TargetResponse;
			ur.User = t.getUser();
			ur.IsFriend = isFriend(u, t);
			r, _ := json.Marshal(ur);
			w.Write(r);
		} else {
			badRequest(w, "user not found", http.StatusBadRequest);
		}
	}
}

func isFriend(u User, t User) bool {
	var uf UserFriend;
	db.Where(&UserFriend{UserID: u.ID, FriendID: t.ID}).First(&uf);
	if uf.UserID == u.ID && uf.FriendID == t.ID {
		return true;
	}
	return false;
}

func (u User) filterRejects(users []User) []User {
	var filtered []User;
	for _,v := range users {
		if v.Email != u.Email && checkReject(u, v) {
			filtered = append(filtered, v)
		}
	}
	return filtered;
}


func (u User) sortUsers(users []User) []User {
	ui := u.getInterests();
	var sortedAndShuffled []User;
	var sorted = make([][]User, len(interests));
	for _, v := range users {
		mi := v.getInterests();
		matches := countMatchingInterests(ui, mi);
		sorted[matches] = append(sorted[matches], v);
	}
	for i, a := range sorted {
		sorted[i] = shuffleUsers(a);
	}	
	for i := len(sorted) - 1; i >= 0; i-- {
		sortedAndShuffled = append(sortedAndShuffled, sorted[i]...);
	}
	return sortedAndShuffled;
}

func shuffleUsers(users []User) []User {
	shuffled := make([]User, len(users));
	perm := rand.Perm(len(users))
	for i, v := range perm {
		shuffled[v] = users[i];
	}
	return shuffled;
}

func countMatchingInterests(ui []string, mi []string) int {
	count := 0;
	uHash := make(map[string]bool, len(ui));
	for _, v := range ui {
		uHash[v] = true;
	}
	for _, m := range mi {
		if uHash[m] == true {
			count ++;
		}
	}
	return count;
}