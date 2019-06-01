package app

import (
	"context"
	"database/sql"
	"log"

	"github.com/christer79/shopper/backend/internal/app/auth"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
type Resolver struct {
	DB *sql.DB
}

func (r *Resolver) DeleteListsDB(name string) {
	sqstm, err := r.DB.Prepare("DROP TABLE " + name + "_items;")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}
	sqstm, err = r.DB.Prepare("DROP TABLE " + name + "_sections;")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}

}

func (r *Resolver) CreateNewListDB(name string) {
	sqstm, err := r.DB.Prepare("CREATE TABLE " + name + "_items(id SERIAL PRIMARY KEY, item_id VARCHAR(50) UNIQUE NOT NULL, item VARCHAR (50) NOT NULL, unit VARCHAR (50) NOT NULL, current_amount FLOAT8 NOT NULL, expected_amount FLOAT8 NOT NULL, amount FLOAT8 NOT NULL, section VARCHAR (50) NOT NULL, checked BOOL NOT NULL);")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}
	sqstm, err = r.DB.Prepare("CREATE TABLE " + name + "_sections(id SERIAL PRIMARY KEY, section_id VARCHAR(50) UNIQUE NOT NULL, title VARCHAR(50) NOT NULL, section_order INTEGER NOT NULL);")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}
}

func (r *Resolver) Mutation() MutationResolver {
	return &mutationResolver{r}
}
func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}
func (r *Resolver) Subscription() SubscriptionResolver {
	return &subscriptionResolver{r}
}

type mutationResolver struct{ *Resolver }

func (r *mutationResolver) CreateList(ctx context.Context, input *NewList) (*List, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	var list_owner = true
	sqstm, err := r.DB.Prepare("INSERT INTO lists(list_id,list_name, user_uid, owner) VALUES($1,$2,$3,$4) RETURNING id")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec(input.ID, input.Name, user.UID, list_owner)
	if err != nil {
		log.Fatal(err)
	}
	r.CreateNewListDB(input.ID)

	return &List{Name: input.Name, ID: input.ID, Sections: []*Section{}, Items: []*Item{}}, nil
}

func (r *mutationResolver) DeleteList(ctx context.Context, id string) (*List, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	var list_owner = true
	sqstm, err := r.DB.Prepare("DELETE FROM lists WHERE list_id = $1 AND user_uid = $2")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec(id, user.UID)
	if err != nil {
		log.Fatal(err)
	}

	// TODO: Verify owner of list before deleting tables, only dete table if all references in tn lists are gone.
	r.DeleteListsDB(id)

	return &List{Name: "", ID: id, Owner: list_owner, Sections: []*Section{}, Items: []*Item{}}, nil
}
func (r *mutationResolver) CreateItem(ctx context.Context, input *NewItem) (*Item, error) {
	panic("not implemented")
}
func (r *mutationResolver) UpdateItem(ctx context.Context, input NewItem) (*Item, error) {
	panic("not implemented")
}
func (r *mutationResolver) DeleteItem(ctx context.Context, id string) (*Item, error) {
	panic("not implemented")
}
func (r *mutationResolver) CreateSection(ctx context.Context, input *NewSection) (*Section, error) {
	panic("not implemented")
}
func (r *mutationResolver) UpdateSection(ctx context.Context, input *NewSection) (*Section, error) {
	panic("not implemented")
}
func (r *mutationResolver) DeleteSection(ctx context.Context, id string) (*Section, error) {
	panic("not implemented")
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Lists(ctx context.Context) ([]*List, error) {
	log.Println("In lists")
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	query := "SELECT id, list_id, list_name , owner FROM lists WHERE user_uid = '" + user.UID + "';"
	log.Printf("query: %v", query)
	rows, err := r.DB.Query(query)
	defer rows.Close()
	if err != nil {
		log.Fatal(err)
	}
	var ret []*List
	for rows.Next() {
		var i List
		var id int
		err := rows.Scan(&id, &i.ID, &i.Name, &i.Owner)
		if err != nil {
			log.Fatal(err)
		}
		log.Println("0")

		log.Printf("List from DB: %v\n", i)
		ret = append(ret, &i)
	}
	return ret, nil
}
func (r *queryResolver) List(ctx context.Context, id string) (*List, error) {
	panic("not implemented")
}
func (r *queryResolver) Suggestions(ctx context.Context) ([]*Suggestion, error) {
	panic("not implemented")
}

type subscriptionResolver struct{ *Resolver }

func (r *subscriptionResolver) ItemChanged(ctx context.Context, input SubscritionInput) (<-chan *Item, error) {
	panic("not implemented")
}
func (r *subscriptionResolver) SectionChanged(ctx context.Context, input SubscritionInput) (<-chan *Section, error) {
	panic("not implemented")
}
