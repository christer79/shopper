package app

import (
	"context"
	"database/sql"
	"log"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
type Resolver struct {
	DB *sql.DB
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
	sqstm, err := r.DB.Prepare("INSERT INTO lists(list_id,list_name) VALUES($1,$2) RETURNING id")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec(input.ID, input.Name)
	if err != nil {
		log.Fatal(err)
	}
	return &List{Name: input.Name, ID: input.ID, Sections: []*Section{}, Items: []*Item{}}, nil
}
func (r *mutationResolver) DeleteList(ctx context.Context, id string) (*List, error) {
	panic("not implemented")
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
